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
            $table->longText('department')->nullable()->change();
            $table->longText('payment_proof')->nullable();
            $table->decimal('delivery', 10)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->longText('department')->nullable(false)->change();
            $table->dropColumn('payment_proof');
            $table->decimal('delivery', 10)->nullable(false)->change();
        });
    }
};
