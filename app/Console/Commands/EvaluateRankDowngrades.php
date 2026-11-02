<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Rank;
use App\Services\FinancialEngine;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class EvaluateRankDowngrades extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'career-plan:evaluate-downgrades 
                            {--dry-run : Simular la evaluación sin modificar la base de datos}
                            {--user-id= : Evaluar únicamente a un promotor específico por su ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalúa los requisitos de los meses cerrados y degrada de rango a los promotores que hayan agotado sus meses de gracia (loss_condition_months).';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $targetUserId = $this->option('user-id');

        $this->info("==========================================================");
        $this->info(" PLAN DE CARRERA: EVALUACIÓN DE DEGRADACIÓN DE RANGOS");
        $this->info(" Modo: " . ($isDryRun ? "SIMULACIÓN (--dry-run: No se guardarán cambios)" : "EJECUCIÓN REAL"));
        $this->info(" Fecha de Cierre Evaluada: " . Carbon::now()->subMonth()->format('F Y'));
        $this->info("==========================================================");

        $engine = new FinancialEngine();
        $initialRank = Rank::orderBy('order_index', 'asc')->first();

        // Obtener todos los rangos ordenados ascendentemente
        $allRanks = Rank::where('status', true)->orderBy('order_index', 'asc')->get();

        // Consultar los promotores (rol Seller) con rango superior al inicial
        $query = User::whereHas('roles', fn($q) => $q->where('name', 'Seller'))
            ->whereNotNull('rank_id')
            ->with('rank');

        if ($initialRank) {
            $query->where('rank_id', '!=', $initialRank->id);
        }

        if ($targetUserId) {
            $query->where('id', $targetUserId);
        }

        $sellers = $query->get();

        if ($sellers->isEmpty()) {
            $this->info("No hay promotores con rangos superiores al inicial para evaluar.");
            return Command::SUCCESS;
        }

        $this->info("Promotores a evaluar: " . $sellers->count());
        $downgradedCount = 0;

        foreach ($sellers as $seller) {
            $currentRank = $seller->rank;

            if (!$currentRank) {
                continue;
            }

            $graceMonths = (int) $currentRank->loss_condition_months;

            // Si loss_condition_months es 0 o menor, el rango no contempla pérdida/degradación
            if ($graceMonths <= 0) {
                $this->line("• [{$seller->name}] Rango: '{$currentRank->name}' — No tiene condición de pérdida configurada (vitalicio).");
                continue;
            }

            $this->line("----------------------------------------------------------");
            $this->line("Evaluando a: <fg=cyan>{$seller->name} {$seller->lastname}</> ({$seller->email})");
            $this->line("Rango Actual: <fg=yellow>{$currentRank->name}</> (Gracia permitida: {$graceMonths} meses)");

            $consecutiveFailures = 0;
            $monthDetails = [];

            // Evaluamos hacia atrás desde el mes recién cerrado (hace 1 mes, hace 2 meses...)
            for ($m = 1; $m <= $graceMonths; $m++) {
                $pastMonthDate = Carbon::now()->subMonths($m);
                $monthLabel = $pastMonthDate->translatedFormat('F Y');

                $complied = $engine->checkRequirementsForMonth($seller, $currentRank, $pastMonthDate);

                if (!$complied) {
                    $consecutiveFailures++;
                    $monthDetails[] = "{$monthLabel}: <fg=red>NO CUMPLIÓ</>";
                } else {
                    $monthDetails[] = "{$monthLabel}: <fg=green>CUMPLIÓ</>";
                    // Si en alguno de los meses de gracia sí cumplió la meta, se corta la racha de pérdidas consecutivas
                    break;
                }
            }

            foreach ($monthDetails as $detail) {
                $this->line("  ↳ " . $detail);
            }

            // Si los meses fallados consecutivos alcanzaron el límite de gracia: DEGRADAR
            if ($consecutiveFailures >= $graceMonths) {
                $downgradedCount++;

                // Buscar el rango más alto que sus números del último mes cerrado sí alcancen a sostener
                $lastClosedMonth = Carbon::now()->subMonth();
                $newRank = $initialRank;

                foreach ($allRanks as $r) {
                    // Solo evaluar rangos menores al actual
                    if ($r->order_index < $currentRank->order_index) {
                        if ($engine->checkRequirementsForMonth($seller, $r, $lastClosedMonth)) {
                            $newRank = $r;
                        }
                    }
                }

                $this->error("  ✖ ALERTA: Agotó los {$graceMonths} meses de gracia consecutivos sin cumplir metas.");
                $this->warn("  ↳ Acción: Degradar de [{$currentRank->name}] a [{$newRank->name}].");

                if (!$isDryRun) {
                    $seller->rank_id = $newRank->id;
                    $seller->save();

                    Log::warning("Plan de Carrera [DEGRADACIÓN]: El promotor {$seller->name} (ID: {$seller->id}) fue degradado de '{$currentRank->name}' a '{$newRank->name}' tras incumplir metas por {$graceMonths} meses consecutivos.");
                }
            } else {
                $remainingGrace = $graceMonths - $consecutiveFailures;
                $this->info("  ✔ Mantiene rango. Meses de gracia restantes antes de perder el nivel: {$remainingGrace}.");
            }
        }

        $this->line("==========================================================");
        if ($isDryRun) {
            $this->info("SIMULACIÓN FINALIZADA. Promotores que calificarían para degradación: {$downgradedCount}");
            $this->comment("Ningún registro fue alterado en la base de datos.");
        } else {
            $this->info("PROCESO FINALIZADO. Promotores degradados: {$downgradedCount}");
        }

        return Command::SUCCESS;
    }
}
