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
        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->boolean('is_agency')->default(false);
            $table->decimal('agency_price', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->dropColumn('is_agency');
            $table->dropColumn('agency_price');
        });
    }
};
