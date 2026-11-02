<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\FinancialEngine;

class RecalculateCareerPlanTotals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'career-plan:recalculate-totals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalcula los totales de grupo (group_points y group_items) de todos los promotores bajo la regla de 2 niveles (Línea 1 + Línea 2).';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Recalculando totales de grupo para todos los promotores (Línea 1 + Línea 2)...");
        
        $engine = new FinancialEngine();
        $engine->recalculateAllUsersTwoLevels();

        $this->info("¡Recálculo completado exitosamente! Todos los totales de grupo ahora reflejan únicamente hasta la 2da línea de afiliados.");
        return Command::SUCCESS;
    }
}
