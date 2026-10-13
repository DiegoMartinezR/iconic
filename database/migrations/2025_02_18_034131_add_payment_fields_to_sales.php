<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('culqi_charge_id')->nullable()->after('status_id');
            $table->enum('payment_status', ['pendiente', 'pagado', 'fallido'])->default('pendiente')->after('culqi_charge_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['culqi_charge_id', 'payment_status']);
        });
    }
};
