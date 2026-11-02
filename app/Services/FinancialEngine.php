<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\User;
use App\Models\Rank;
use App\Models\Commission;
use App\Models\RankBonus;
use App\Models\UserMilestone;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FinancialEngine
{
    public function processSale(Sale $sale)
    {
        DB::beginTransaction();
        try {
            // 1. Calcular Comisiones para el Promotor (Vendedor) si existe
            if ($sale->referrer_id) {
                $promoter = User::find($sale->referrer_id);
                if ($promoter) {
                    $this->calculateCommissions($sale, $promoter);
                    $this->evaluateUser($promoter);
                }
            }

            // 2. Calcular Ganancias para los Proveedores
            $this->calculateProviderEarnings($sale);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error("Error en FinancialEngine::processSale: " . $th->getMessage());
            throw $th;
        }
    }

    /**
     * Calcula las ganancias para los proveedores involucrados en la venta
     */
    private function calculateProviderEarnings(Sale $sale)
    {
        foreach ($sale->details as $detail) {
            if ($detail->provider_id && $detail->provider_price > 0) {
                // Verificar si ya existe este registro para evitar duplicados
                $exists = Commission::where('sale_detail_id', $detail->id)
                    ->where('user_id', $detail->provider_id)
                    ->where('type', 'provider_earning')
                    ->exists();
                
                if ($exists) continue;

                Commission::create([
                    'user_id' => $detail->provider_id,
                    'sale_id' => $sale->id,
                    'sale_detail_id' => $detail->id,
                    'amount' => $detail->provider_price * $detail->quantity,
                    'base_amount' => $detail->price * $detail->quantity,
                    'percent' => 0,
                    'type' => 'provider_earning',
                    'description' => "Pago por producto: " . ($detail->item->name ?? $detail->combo->name ?? "Producto"),
                    'status' => $this->isFinalStatus($sale->status) ? 'approved' : 'pending'
                ]);
            }
        }
    }

    /**
     * Calcula las comisiones de la venta para el promotor
     */
    private function calculateCommissions(Sale $sale, User $promoter)
    {
        $rank = $promoter->rank ?? Rank::orderBy('order_index', 'asc')->first();

        $normalPercent = $rank ? $rank->commission_percent : 0;
        $prizePercent = $rank ? $rank->prize_commission_percent : 100;

        foreach ($sale->details as $detail) {
            $isPrize = $detail->is_prize;
            $percent = $isPrize ? $prizePercent : $normalPercent;

            if ($percent <= 0) continue;

            $baseAmount = $detail->price * $detail->quantity;
            $commissionAmount = ($baseAmount * $percent) / 100;

            Commission::create([
                'user_id' => $promoter->id,
                'sale_id' => $sale->id,
                'amount' => $commissionAmount,
                'base_amount' => $baseAmount,
                'percent' => $percent,
                'type' => $isPrize ? 'prize' : 'normal',
                'description' => "Comisión por " . ($detail->item->name ?? $detail->combo->name ?? "Producto"),
                'status' => $this->isFinalStatus($sale->status) ? 'approved' : 'pending'
            ]);
        }
    }

    /**
     * Aprueba las comisiones de una venta si el estado es final.
     */
    public function approveCommissionsForSale(Sale $sale)
    {
        if ($this->isFinalStatus($sale->status)) {
            Commission::where('sale_id', $sale->id)
                ->where('status', 'pending')
                ->update(['status' => 'approved']);
            Log::info("Comisiones aprobadas para la venta: {$sale->code}");
        }
    }

    /**
     * Determina si un estado de venta permite liberar comisiones.
     */
    private function isFinalStatus($status): bool
    {
        if (!$status) return false;
        $name = strtolower($status->name);
        return in_array($name, ['entregado', 'culminado', 'completado']);
    }

    /**
     * Re-calcula puntos y evalúa rangos/bonos para un usuario específico (usado en cierres o recálculos masivos)
     */
    public function evaluateUser(User $user)
    {
        // 1. Actualizar Puntos (Volumen de ventas)
        $this->updateUserPoints($user);

        // 2. Evaluar ascenso de Rango
        $this->evaluateRankUpgrade($user);

        // 3. Evaluar Bonos (Milestones)
        $this->evaluateRankBonuses($user);
    }

    /**
     * Actualiza los puntos totales del usuario y propaga a grupos
     */
    private function updateUserPoints(User $user)
    {
        // Calculamos el volumen total de ventas pagadas donde él es el referidor
        // Aseguramos que solo sumamos ventas confirmadas (Pagado)
        $totalVolume = Sale::where('referrer_id', $user->id)
            ->whereHas('status', function($q) {
                $q->where('name', 'like', '%Pagado%');
            })
            ->sum('total_amount');

        // Calculamos la cantidad total de prendas vendidas
        $totalItems = DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->join('sale_statuses', 'sales.status_id', '=', 'sale_statuses.id')
            ->where('sales.referrer_id', $user->id)
            ->where('sale_statuses.name', 'like', '%Pagado%')
            ->sum('sale_details.quantity');

        $user->total_points = $totalVolume;
        $user->total_items = $totalItems;
        $user->save();

        // Actualizar totales de grupo para él y sus ancestros (hasta 2 generaciones hacia arriba)
        $this->updateGroupTotalsUpwards($user);
    }

    /**
     * Obtiene los IDs de los descendientes de hasta la 2da línea (Nivel 1 directos + Nivel 2 nietos).
     */
    public function getTwoLevelsDescendantIds($userId): array
    {
        $id = is_object($userId) ? $userId->id : $userId;

        // Nivel 1: Afiliados directos
        $level1Ids = User::where('referred_by', $id)->pluck('id')->toArray();
        if (empty($level1Ids)) {
            return [];
        }

        // Nivel 2: Afiliados de los directos (nietos)
        $level2Ids = User::whereIn('referred_by', $level1Ids)->pluck('id')->toArray();

        return array_unique(array_merge($level1Ids, $level2Ids));
    }

    /**
     * Calcula y guarda los totales de grupo para un usuario considerando únicamente
     * sus ventas personales + ventas personales de su Línea 1 + ventas personales de su Línea 2.
     */
    public function updateGroupTotals(User $user)
    {
        $descendantIds = $this->getTwoLevelsDescendantIds($user->id);

        if (empty($descendantIds)) {
            $user->group_points = $user->total_points;
            $user->group_items = $user->total_items;
        } else {
            // Sumar las ventas personales (total_points y total_items) exclusivamente de línea 1 y línea 2
            $networkTotals = User::whereIn('id', $descendantIds)
                ->selectRaw('COALESCE(SUM(total_points), 0) as net_points, COALESCE(SUM(total_items), 0) as net_items')
                ->first();

            $user->group_points = $user->total_points + (float) ($networkTotals->net_points ?? 0);
            $user->group_items = $user->total_items + (float) ($networkTotals->net_items ?? 0);
        }

        $user->save();
    }

    /**
     * Propaga la actualización de ventas personales hacia arriba en el árbol:
     * Solo afecta a su patrocinador directo (Nivel 1 arriba) y al patrocinador de este (Nivel 2 arriba).
     */
    public function updateGroupTotalsUpwards(User $user)
    {
        // 1. Actualizar el propio usuario
        $this->updateGroupTotals($user);

        // 2. Patrocinador directo (para quien este usuario es Línea 1)
        if ($user->referred_by) {
            $parent = User::find($user->referred_by);
            if ($parent) {
                $this->updateGroupTotals($parent);
                $this->evaluateRankUpgrade($parent);
                $this->evaluateRankBonuses($parent);

                // 3. Patrocinador del patrocinador (para quien este usuario es Línea 2)
                if ($parent->referred_by) {
                    $grandparent = User::find($parent->referred_by);
                    if ($grandparent) {
                        $this->updateGroupTotals($grandparent);
                        $this->evaluateRankUpgrade($grandparent);
                        $this->evaluateRankBonuses($grandparent);
                    }
                }
            }
        }
    }

    /**
     * Alias de compatibilidad
     */
    public function updateGroupTotalsRecursively(User $user)
    {
        $this->updateGroupTotalsUpwards($user);
    }

    /**
     * Evalúa si el usuario debe subir de rango basado en el plan de carrera
     */
    private function evaluateRankUpgrade(User $user)
    {
        $allRanks = Rank::where('status', true)->orderBy('order_index', 'asc')->get();
        $bestRank = $user->rank;

        foreach ($allRanks as $rank) {
            $personalValue = ($rank->requirement_type === 'items') ? $user->total_items : $user->total_points;
            $groupValue = ($rank->requirement_type === 'items') ? $user->group_items : $user->group_points;

            // 1. Verificar Metas de Volumen (Items/Ventas)
            $achievedVolume = false;
            if ($rank->requirement_logic === 'AND') {
                $achievedVolume = ($personalValue >= $rank->min_personal_items) && ($groupValue >= $rank->min_group_items);
            } else {
                $pOk = ($rank->min_personal_items > 0) ? ($personalValue >= $rank->min_personal_items) : false;
                $gOk = ($rank->min_group_items > 0) ? ($groupValue >= $rank->min_group_items) : false;
                $achievedVolume = ($rank->min_personal_items <= 0 && $rank->min_group_items <= 0) ? true : ($pOk || $gOk);
            }

            // 2. Verificar Reclutas Activos
            $activeRecruits = $this->countActiveRecruits($user, $rank->min_active_seller_amount);
            $achievedRecruits = ($activeRecruits >= $rank->min_active_recruits);

            // 3. Verificar Líderes (Equipos)
            $leadersCount = $this->countLeaders($user, $rank->recruits_per_leader);
            $achievedLeaders = ($leadersCount >= $rank->min_leaders);

            // 4. Verificar Meses de Mantenimiento (si aplica)
            $achievedMaintenance = true;
            if ($rank->maintenance_months > 0) {
                $achievedMaintenance = $this->checkMaintenanceMonths($user, $rank);
            }

            if ($achievedVolume && $achievedRecruits && $achievedLeaders && $achievedMaintenance) {
                // Si el rango es mayor en orden o es el primero que cumple
                if (!$bestRank || $rank->order_index > $bestRank->order_index) {
                    $bestRank = $rank;
                }
            }
        }

        if ($bestRank && $user->rank_id !== $bestRank->id) {
            $user->rank_id = $bestRank->id;
            $user->save();

            Log::info("Usuario {$user->name} ha subido al rango: {$bestRank->name}");

            // 1. Otorga el bono fijo directo del rango si existe
            if ($bestRank->bonus_amount > 0) {
                $this->awardRankUpBonus($user, $bestRank);
            }

            // 2. Busca y otorga todos los bonos tipo 'attainment' vinculados a este rango
            $onUpgradeBonuses = RankBonus::where('rank_id', $bestRank->id)
                ->where('trigger_type', 'attainment')
                ->where('status', true)
                ->get();

            foreach ($onUpgradeBonuses as $bonus) {
                $this->awardBonus($user, $bonus);
            }
        }
    }

    /**
     * Otorga el bono por ascenso de rango (Bono Fijo principal)
     */
    private function awardRankUpBonus(User $user, Rank $rank)
    {
        // Verificar si ya se le otorgó este bono de ascenso (una sola vez por el ID del rango)
        $alreadyAwarded = UserMilestone::where('user_id', $user->id)
            ->whereNull('rank_bonus_id')
            ->where('description', 'like', "%alcanzar el rango {$rank->name}%")
            ->exists();

        if ($alreadyAwarded) return;

        $commission = Commission::create([
            'user_id' => $user->id,
            'amount' => $rank->bonus_amount,
            'base_amount' => $rank->min_personal_items ?: $rank->min_group_items,
            'percent' => 0,
            'type' => 'bonus',
            'description' => "Bono por alcanzar el rango " . $rank->name,
            'status' => 'approved'
        ]);

        UserMilestone::create([
            'user_id' => $user->id,
            'rank_bonus_id' => null,
            'commission_id' => $commission->id,
            'description' => "Bono por alcanzar el rango " . $rank->name,
            'achieved_at' => now(),
        ]);
        
        Log::info("¡Bono por ascenso otorgado! Usuario {$user->name} ganó S/ {$rank->bonus_amount} por subir a {$rank->name}");
    }

    /**
     * Evalúa si el usuario es acreedor a algún bono por su desempeño grupal o personal (Disparador por Volumen)
     */
    private function evaluateRankBonuses(User $user)
    {
        // Obtenemos todos los bonos activos tipo VOLUMEN
        $activeBonuses = RankBonus::where('status', true)
            ->where('trigger_type', 'volume')
            ->get();
        
        foreach ($activeBonuses as $bonus) {
            // Si el bono requiere un rango específico, verificarlo
            if ($bonus->rank_id && $user->rank_id !== $bonus->rank_id) {
                continue;
            }

            $valueToCheck = 0;
            if ($bonus->type === 'items') {
                $valueToCheck = $bonus->is_group ? $user->group_items : $user->total_items;
            } else {
                $valueToCheck = $bonus->is_group ? $user->group_points : $user->total_points;
            }

            if ($valueToCheck >= $bonus->min_value) {
                // Verificar si ya se le otorgó este bono en el mes actual
                $alreadyAchieved = UserMilestone::where('user_id', $user->id)
                    ->where('rank_bonus_id', $bonus->id)
                    ->whereBetween('achieved_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
                    ->exists();

                if (!$alreadyAchieved) {
                    $this->awardBonus($user, $bonus);
                }
            }
        }
    }

    /**
     * Otorga el bono al usuario y registra el hito
     */
    private function awardBonus(User $user, RankBonus $bonus)
    {
        $commission = Commission::create([
            'user_id' => $user->id,
            'amount' => $bonus->bonus_amount,
            'base_amount' => $bonus->min_value,
            'percent' => 0,
            'type' => 'bonus',
            'description' => "Bono Extra: " . $bonus->name,
            'status' => 'approved'
        ]);

        UserMilestone::create([
            'user_id' => $user->id,
            'rank_bonus_id' => $bonus->id,
            'commission_id' => $commission->id,
            'description' => "Bono alcanzado: " . $bonus->name,
            'achieved_at' => now(),
        ]);

        Log::info("¡Bono extra otorgado! Usuario {$user->name} ganó S/ {$bonus->bonus_amount} por {$bonus->name}");
    }

    /**
     * Cuenta cuántos reclutas directos del usuario tienen compras mayores a $minAmount en un periodo dado.
     */
    public function countActiveRecruits(User $user, float $minAmount, Carbon $date = null): int
    {
        if ($minAmount <= 0) return 0;

        $date = $date ?? Carbon::now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        // Obtener referidos directos
        $referralIds = User::where('referred_by', $user->id)->pluck('id');

        if ($referralIds->isEmpty()) {
            return 0;
        }

        // Contar cuántos de esos referidos tienen ventas mayores a $minAmount en el periodo.
        return Sale::whereIn('referrer_id', $referralIds)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->whereHas('status', function($q) {
                $q->where('name', 'like', '%Pagado%');
            })
            ->select('referrer_id')
            ->groupBy('referrer_id')
            ->havingRaw('SUM(total_amount) >= ?', [$minAmount])
            ->get()
            ->count();
    }

    /**
     * Cuenta cuántos líderes (referidos directos) tienen al menos $minTeamSize reclutas en su equipo (recursivo).
     */
    public function countLeaders(User $user, int $minTeamSize): int
    {
        if ($minTeamSize <= 0) return 0;

        $referralIds = User::where('referred_by', $user->id)->pluck('id');
        
        if ($referralIds->isEmpty()) {
            return 0;
        }

        $leadersCount = 0;
        foreach ($referralIds as $referralId) {
            // Contar todo el equipo del referido (recursivo)
            $teamSize = $this->getTeamSizeRecursive($referralId);
            if ($teamSize >= $minTeamSize) {
                $leadersCount++;
            }
        }

        return $leadersCount;
    }

    /**
     * Obtiene el tamaño total del equipo (descendientes) de un usuario.
     */
    public function getTeamSizeRecursive($userId): int
    {
        $count = 0;
        $childrenIds = User::where('referred_by', $userId)->pluck('id');
        
        $count += $childrenIds->count();
        
        foreach ($childrenIds as $childId) {
            $count += $this->getTeamSizeRecursive($childId);
        }
        
        return $count;
    }

    /**
     * Verifica si el usuario ha mantenido los requisitos base de un rango durante $maintenanceMonths meses.
     */
    private function checkMaintenanceMonths(User $user, Rank $rank): bool
    {
        if ($rank->maintenance_months <= 0) return true;

        // Debemos verificar los últimos N meses (incluyendo el actual ya verificado en el loop principal)
        // Empezamos desde el mes pasado y vamos hacia atrás
        for ($i = 1; $i < $rank->maintenance_months; $i++) {
            $checkDate = Carbon::now()->subMonths($i);
            if (!$this->checkRequirementsForMonth($user, $rank, $checkDate)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Verifica si el usuario cumplió los requisitos de un rango en un mes específico.
     */
    public function checkRequirementsForMonth(User $user, Rank $rank, Carbon $date): bool
    {
        $start = $date->copy()->startOfMonth();
        $end = $date->copy()->endOfMonth();

        // 1. Calcular Volumen del mes
        $personalPoints = Sale::where('referrer_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->whereHas('status', fn($q) => $q->where('name', 'like', '%Pagado%'))
            ->sum('total_amount');

        $personalItems = DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->join('sale_statuses', 'sales.status_id', '=', 'sale_statuses.id')
            ->where('sales.referrer_id', $user->id)
            ->whereBetween('sales.created_at', [$start, $end])
            ->where('sale_statuses.name', 'like', '%Pagado%')
            ->sum('sale_details.quantity');

        // Para volumen de grupo en el periodo, sumamos ventas personales de descendientes de hasta 2 niveles (Línea 1 + Línea 2)
        $descendantIds = $this->getTwoLevelsDescendantIds($user->id);
        
        $groupPoints = Sale::whereIn('referrer_id', $descendantIds)
            ->whereBetween('created_at', [$start, $end])
            ->whereHas('status', fn($q) => $q->where('name', 'like', '%Pagado%'))
            ->sum('total_amount') + $personalPoints;

        $groupItems = DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->join('sale_statuses', 'sales.status_id', '=', 'sale_statuses.id')
            ->whereIn('sales.referrer_id', $descendantIds)
            ->whereBetween('sales.created_at', [$start, $end])
            ->where('sale_statuses.name', 'like', '%Pagado%')
            ->sum('sale_details.quantity') + $personalItems;

        $personalValue = ($rank->requirement_type === 'items') ? $personalItems : $personalPoints;
        $groupValue = ($rank->requirement_type === 'items') ? $groupItems : $groupPoints;

        // Validar Volumen
        $achievedVolume = false;
        if ($rank->requirement_logic === 'AND') {
            $achievedVolume = ($personalValue >= $rank->min_personal_items) && ($groupValue >= $rank->min_group_items);
        } else {
            $pOk = ($rank->min_personal_items > 0) ? ($personalValue >= $rank->min_personal_items) : false;
            $gOk = ($rank->min_group_items > 0) ? ($groupValue >= $rank->min_group_items) : false;
            $achievedVolume = ($rank->min_personal_items <= 0 && $rank->min_group_items <= 0) ? true : ($pOk || $gOk);
        }

        if (!$achievedVolume) return false;

        // 2. Validar Reclutas Activos en ese mes
        $activeRecruits = $this->countActiveRecruits($user, $rank->min_active_seller_amount, $date);
        if ($activeRecruits < $rank->min_active_recruits) return false;

        // 3. Validar Líderes
        $leadersCount = $this->countLeaders($user, $rank->recruits_per_leader);
        if ($leadersCount < $rank->min_leaders) return false;

        return true;
    }

    /**
     * Recalcula los puntos y totales de grupo de todos los vendedores bajo la regla estricta de 2 niveles.
     */
    public function recalculateAllUsersTwoLevels()
    {
        $sellers = User::whereHas('roles', fn($q) => $q->where('name', 'Seller'))->get();

        // 1. Recalcular ventas personales de todos
        foreach ($sellers as $seller) {
            $totalVolume = Sale::where('referrer_id', $seller->id)
                ->whereHas('status', fn($q) => $q->where('name', 'like', '%Pagado%'))
                ->sum('total_amount');

            $totalItems = DB::table('sales')
                ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
                ->join('sale_statuses', 'sales.status_id', '=', 'sale_statuses.id')
                ->where('sales.referrer_id', $seller->id)
                ->where('sale_statuses.name', 'like', '%Pagado%')
                ->sum('sale_details.quantity');

            $seller->total_points = $totalVolume;
            $seller->total_items = $totalItems;
            $seller->save();
        }

        // 2. Con las ventas personales actualizadas, calcular el grupo (Nivel 1 + Nivel 2)
        foreach ($sellers as $seller) {
            $this->updateGroupTotals($seller);
            $this->evaluateRankUpgrade($seller);
            $this->evaluateRankBonuses($seller);
        }
    }

    /**
     * Obtiene todos los IDs de los descendientes en el árbol (recursivo ilimitado para árbol o métricas globales).
     */
    public function getAllDescendantIds($userId): array
    {
        $id = is_object($userId) ? $userId->id : $userId;
        $ids = [];
        $childrenIds = User::where('referred_by', $id)->pluck('id')->toArray();
        
        $ids = array_merge($ids, $childrenIds);
        
        foreach ($childrenIds as $childId) {
            $ids = array_merge($ids, $this->getAllDescendantIds($childId));
        }
        
        return array_unique($ids);
    }
}
