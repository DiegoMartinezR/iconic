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
        Schema::table('inventory_vault', function (Blueprint $table) {
            $table->string('destination')->default('for_sale')->after('quantity'); // 'for_sale' o 'claim_physical'
            $table->string('claim_type')->nullable()->after('destination'); // 'delivery' o 'store_pickup'
            $table->string('claim_status')->nullable()->after('claim_type'); // 'pending', 'coordinated', 'delivered'
            $table->text('claim_address')->nullable()->after('claim_status');
            $table->text('claim_notes')->nullable()->after('claim_address');
            $table->timestamp('claimed_at')->nullable()->after('claim_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_vault', function (Blueprint $table) {
            $table->dropColumn([
                'destination',
                'claim_type',
                'claim_status',
                'claim_address',
                'claim_notes',
                'claimed_at'
            ]);
        });
    }
};
