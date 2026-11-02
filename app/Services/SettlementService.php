<?php

namespace App\Services;

use App\Models\User;
use App\Models\Sale;
use App\Models\Rank;
use App\Models\RankBonus;
use App\Models\Commission;
use App\Models\UserMilestone;
use App\Models\Withdrawal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SettlementService
{
    protected WalletService $walletService;
    protected FinancialEngine $engine;

    public function __construct(WalletService $walletService, FinancialEngine $engine)
    {
        $this->walletService = $walletService;
        $this->engine = $engine;
    }

    /**
     * Obtiene el reporte y consolidado completo de liquidación para un vendedor en un periodo específico (año y mes).
     */
    public function getSettlementData(User $seller, int $year, int $month): array
    {
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        // 1. Información del Vendedor y Rango Actual
        $seller->load('rank');
        $currentRank = $seller->rank ?? Rank::where('status', true)->orderBy('order_index', 'asc')->first();

        // 2. Ventas Personales en el Periodo
        $personalSalesQuery = Sale::where('referrer_id', $seller->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth]);

        $personalSales = (clone $personalSalesQuery)
            ->with(['status', 'details.item'])
            ->orderBy('created_at', 'desc')
            ->get();

        $personalOrdersCount = $personalSales->count();
        $personalTotalSales = (float)$personalSales->sum('total_amount');

        $personalItemsCount = (int)DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->where('sales.referrer_id', $seller->id)
            ->whereBetween('sales.created_at', [$startOfMonth, $endOfMonth])
            ->sum('sale_details.quantity');

        // Ventas confirmadas/pagadas
        $confirmedPersonalSales = $personalSales->filter(function ($s) {
            $name = strtolower($s->status?->name ?? '');
            return str_contains($name, 'pagado') || str_contains($name, 'entregado') || str_contains($name, 'completado');
        });
        $confirmedPersonalAmount = (float)$confirmedPersonalSales->sum('total_amount');

        // 3. Ventas de Red Grupal (Línea 1 directos + Línea 2 nietos) en el Periodo
        $descendantIds = $this->engine->getTwoLevelsDescendantIds($seller->id);
        $groupOrdersCount = 0;
        $groupTotalSales = 0.0;
        $groupItemsCount = 0;
        $networkMembersCount = count($descendantIds);

        if (!empty($descendantIds)) {
            $groupSales = Sale::whereIn('referrer_id', $descendantIds)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->get();

            $groupOrdersCount = $groupSales->count();
            $groupTotalSales = (float)$groupSales->sum('total_amount');

            $groupItemsCount = (int)DB::table('sales')
                ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
                ->whereIn('sales.referrer_id', $descendantIds)
                ->whereBetween('sales.created_at', [$startOfMonth, $endOfMonth])
                ->sum('sale_details.quantity');
        }

        $totalCombinedItems = $personalItemsCount + $groupItemsCount;
        $totalCombinedSales = $personalTotalSales + $groupTotalSales;

        // 4. Comisiones del Periodo
        $commissions = Commission::where('user_id', $seller->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->with(['sale.status'])
            ->orderBy('created_at', 'desc')
            ->get();

        $directCommissions = (float)$commissions->where('type', 'normal')->sum('amount');
        $vaultPrizeCommissions = (float)$commissions->where('type', 'prize')->sum('amount');
        $bonusCommissions = (float)$commissions->where('type', 'bonus')->sum('amount');

        $approvedCommissions = (float)$commissions->whereIn('status', ['approved', 'paid'])->sum('amount');
        $pendingCommissions = (float)$commissions->where('status', 'pending')->sum('amount');
        $totalMonthCommissions = (float)$commissions->sum('amount');

        // 5. Bonos Ganados / Reclamados en el Periodo
        $bonusesAchieved = UserMilestone::where('user_id', $seller->id)
            ->whereBetween('achieved_at', [$startOfMonth, $endOfMonth])
            ->with(['bonus', 'commission'])
            ->orderBy('achieved_at', 'desc')
            ->get()
            ->map(function ($milestone) {
                return [
                    'id' => $milestone->id,
                    'name' => $milestone->description,
                    'amount' => (float)($milestone->commission?->amount ?? $milestone->bonus?->bonus_amount ?? 0),
                    'achieved_at' => $milestone->achieved_at?->format('d/m/Y H:i'),
                    'bonus_type' => $milestone->bonus?->type ?? 'Rango/Hito',
                ];
            });

        // 6. Diagnóstico de Bonos y Metas Activas (¿Cuánto le falta para cada una?)
        $activeBonuses = RankBonus::where('status', true)->get();
        $goalsProgress = [];

        foreach ($activeBonuses as $bonus) {
            $isAchievedThisMonth = $bonusesAchieved->contains(function ($item) use ($bonus) {
                return str_contains(strtolower($item['name']), strtolower($bonus->name));
            });

            // Medición actual
            $actualValue = 0;
            if ($bonus->type === 'items') {
                $actualValue = $bonus->is_group ? $totalCombinedItems : $personalItemsCount;
            } else {
                $actualValue = $bonus->is_group ? $totalCombinedSales : $personalTotalSales;
            }

            $minValue = (float)$bonus->min_value;
            $missing = max(0, $minValue - $actualValue);
            $percentage = $minValue > 0 ? min(100, round(($actualValue / $minValue) * 100, 1)) : 100;

            $goalsProgress[] = [
                'id' => $bonus->id,
                'name' => $bonus->name,
                'description' => $bonus->description,
                'type' => $bonus->type, // 'items' o 'money'
                'is_group' => (bool)$bonus->is_group,
                'bonus_amount' => (float)$bonus->bonus_amount,
                'target_value' => $minValue,
                'actual_value' => (float)$actualValue,
                'missing_value' => (float)$missing,
                'percentage' => $percentage,
                'achieved' => $isAchievedThisMonth || ($missing <= 0),
                'unit' => $bonus->type === 'items' ? 'productos' : 'S/',
            ];
        }

        // 7. Diagnóstico de Progreso de Rango (¿Cuánto le falta para subir de rango?)
        $nextRank = Rank::where('status', true)
            ->where('order_index', '>', $currentRank?->order_index ?? 0)
            ->orderBy('order_index', 'asc')
            ->first();

        $rankProgression = null;
        if ($nextRank) {
            // Reclutas Activos del mes actual
            $minActiveAmount = $nextRank->min_active_seller_amount ?? 300;
            $activeRecruitsCount = User::where('referred_by', $seller->id)
                ->whereHas('roles', fn($q) => $q->where('name', 'Seller'))
                ->whereHas('commissions', function ($q) use ($startOfMonth, $endOfMonth, $minActiveAmount) {
                    $q->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                        ->selectRaw('SUM(amount) as total')
                        ->havingRaw('SUM(amount) >= ?', [$minActiveAmount]);
                })->count();

            // Líderes con equipo
            $recruitsPerLeader = $nextRank->recruits_per_leader ?? 10;
            $leadersCount = 0;
            $directSellers = User::where('referred_by', $seller->id)
                ->whereHas('roles', fn($q) => $q->where('name', 'Seller'))
                ->get();

            foreach ($directSellers as $ds) {
                if ($this->engine->getTeamSizeRecursive($ds) >= $recruitsPerLeader) {
                    $leadersCount++;
                }
            }

            // Chequeo de meses de mantenimiento
            $maintenanceMet = $this->engine->checkRequirementsForMonth($seller, $nextRank, $startOfMonth) ? 1 : 0;

            // Faltantes
            $reqPersonalItems = (float)$nextRank->min_personal_items;
            $missingPersonalItems = max(0, $reqPersonalItems - $personalItemsCount);

            $reqGroupItems = (float)$nextRank->min_group_items;
            $missingGroupItems = max(0, $reqGroupItems - $totalCombinedItems);

            $reqActiveRecruits = (int)$nextRank->min_active_recruits;
            $missingActiveRecruits = max(0, $reqActiveRecruits - $activeRecruitsCount);

            $reqLeaders = (int)$nextRank->min_leaders;
            $missingLeaders = max(0, $reqLeaders - $leadersCount);

            $rankProgression = [
                'current_rank' => [
                    'id' => $currentRank?->id,
                    'name' => $currentRank?->name ?? 'Sin Rango',
                    'color' => $currentRank?->color ?? '#6c757d',
                    'order_index' => $currentRank?->order_index ?? 0,
                    'commission_percent' => (float)($currentRank?->commission_percent ?? 0),
                ],
                'next_rank' => [
                    'id' => $nextRank->id,
                    'name' => $nextRank->name,
                    'color' => $nextRank->color ?? '#0acf97',
                    'order_index' => $nextRank->order_index,
                    'commission_percent' => (float)$nextRank->commission_percent,
                    'bonus_amount' => (float)$nextRank->bonus_amount,
                ],
                'requirements' => [
                    'personal_items' => [
                        'required' => $reqPersonalItems,
                        'actual' => $personalItemsCount,
                        'missing' => $missingPersonalItems,
                        'percentage' => $reqPersonalItems > 0 ? min(100, round(($personalItemsCount / $reqPersonalItems) * 100, 1)) : 100,
                        'completed' => $missingPersonalItems <= 0,
                    ],
                    'group_items' => [
                        'required' => $reqGroupItems,
                        'actual' => $totalCombinedItems,
                        'missing' => $missingGroupItems,
                        'percentage' => $reqGroupItems > 0 ? min(100, round(($totalCombinedItems / $reqGroupItems) * 100, 1)) : 100,
                        'completed' => $missingGroupItems <= 0,
                    ],
                    'active_recruits' => [
                        'required' => $reqActiveRecruits,
                        'actual' => $activeRecruitsCount,
                        'missing' => $missingActiveRecruits,
                        'min_amount_each' => (float)$minActiveAmount,
                        'percentage' => $reqActiveRecruits > 0 ? min(100, round(($activeRecruitsCount / $reqActiveRecruits) * 100, 1)) : 100,
                        'completed' => $missingActiveRecruits <= 0,
                    ],
                    'leaders' => [
                        'required' => $reqLeaders,
                        'actual' => $leadersCount,
                        'missing' => $missingLeaders,
                        'percentage' => $reqLeaders > 0 ? min(100, round(($leadersCount / $reqLeaders) * 100, 1)) : 100,
                        'completed' => $missingLeaders <= 0,
                    ],
                    'maintenance_months' => [
                        'required' => (int)$nextRank->maintenance_months,
                        'actual' => $maintenanceMet,
                        'missing' => max(0, (int)$nextRank->maintenance_months - $maintenanceMet),
                        'completed' => $maintenanceMet >= (int)$nextRank->maintenance_months,
                    ],
                ],
            ];
        }

        // 8. Solicitudes de Retiro y Liquidación Financiera
        $monthWithdrawals = Withdrawal::where('user_id', $seller->id)
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->orWhere('status', 'pending');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingWithdrawal = $monthWithdrawals->where('status', 'pending')->first();
        $completedWithdrawalsAmount = (float)$monthWithdrawals->where('status', 'completed')->sum('amount');

        // Billetera general
        $totalEarnedAllTime = (float)$this->walletService->getTotalEarned($seller);
        $availableBalanceNow = (float)$this->walletService->getAvailableBalance($seller);

        // Saldo total que corresponde liquidar de este periodo (ganado aprobado en el mes)
        $totalEarnedThisMonth = $approvedCommissions; // Incluye normales, de bóveda y bonos aprobados
        $netOwedToSeller = $pendingWithdrawal ? (float)$pendingWithdrawal->amount : min($availableBalanceNow, $totalEarnedThisMonth);

        return [
            'period' => [
                'year' => $year,
                'month' => $month,
                'month_name' => $startOfMonth->translatedFormat('F Y'),
                'start_date' => $startOfMonth->format('Y-m-d'),
                'end_date' => $endOfMonth->format('Y-m-d'),
                'is_current_month' => $startOfMonth->isCurrentMonth(),
            ],
            'seller' => [
                'id' => $seller->id,
                'name' => $seller->name,
                'email' => $seller->email,
                'phone' => $seller->phone,
                'document' => $seller->document,
                'uuid' => $seller->uuid,
                'bank_details' => [
                    'bank_name' => $seller->bank_name,
                    'account_number' => $seller->account_number,
                    'cci_number' => $seller->cci_number,
                    'yape_plin_number' => $seller->yape_plin_number,
                ],
            ],
            'summary' => [
                'total_earned_month' => $totalEarnedThisMonth,
                'direct_commissions' => $directCommissions,
                'vault_commissions' => $vaultPrizeCommissions,
                'bonus_commissions' => $bonusCommissions,
                'approved_commissions' => $approvedCommissions,
                'pending_commissions' => $pendingCommissions,
                'personal_sales_amount' => $personalTotalSales,
                'personal_items_count' => $personalItemsCount,
                'personal_orders_count' => $personalOrdersCount,
                'group_sales_amount' => $groupTotalSales,
                'group_items_count' => $groupItemsCount,
                'group_orders_count' => $groupOrdersCount,
                'network_members_count' => $networkMembersCount,
                'total_combined_items' => $totalCombinedItems,
                'total_combined_sales' => $totalCombinedSales,
                'available_balance_now' => $availableBalanceNow,
                'total_earned_all_time' => $totalEarnedAllTime,
                'net_owed_to_seller' => $netOwedToSeller,
                'has_pending_withdrawal' => !empty($pendingWithdrawal),
                'pending_withdrawal_amount' => (float)($pendingWithdrawal?->amount ?? 0),
            ],
            'rank_progression' => $rankProgression,
            'goals_progress' => $goalsProgress,
            'bonuses_achieved' => $bonusesAchieved,
            'commissions' => $commissions->map(function ($c) {
                return [
                    'id' => $c->id,
                    'amount' => (float)$c->amount,
                    'base_amount' => (float)$c->base_amount,
                    'percent' => (float)$c->percent,
                    'type' => $c->type,
                    'description' => $c->description,
                    'status' => $c->status,
                    'created_at' => $c->created_at?->format('d/m/Y H:i'),
                    'sale_code' => $c->sale?->code ?? 'N/A',
                ];
            }),
            'personal_sales' => $personalSales->map(function ($s) {
                return [
                    'id' => $s->id,
                    'code' => $s->code,
                    'total_amount' => (float)$s->total_amount,
                    'created_at' => $s->created_at?->format('d/m/Y H:i'),
                    'status' => $s->status?->name ?? 'Pendiente',
                    'status_color' => $s->status?->color ?? '#6c757d',
                    'items_count' => (int)$s->details->sum('quantity'),
                    'customer_name' => $s->name . ' ' . $s->lastname,
                ];
            }),
            'withdrawals' => $monthWithdrawals->map(function ($w) {
                return [
                    'id' => $w->id,
                    'amount' => (float)$w->amount,
                    'status' => $w->status,
                    'method' => $w->method,
                    'details' => $w->details,
                    'notes' => $w->notes,
                    'receipt_path' => $w->receipt_path,
                    'created_at' => $w->created_at?->format('d/m/Y H:i'),
                    'processed_at' => $w->processed_at?->format('d/m/Y H:i'),
                ];
            }),
            'pending_withdrawal' => $pendingWithdrawal ? [
                'id' => $pendingWithdrawal->id,
                'amount' => (float)$pendingWithdrawal->amount,
                'method' => $pendingWithdrawal->method,
                'details' => $pendingWithdrawal->details,
                'created_at' => $pendingWithdrawal->created_at?->format('d/m/Y H:i'),
            ] : null,
        ];
    }
}
