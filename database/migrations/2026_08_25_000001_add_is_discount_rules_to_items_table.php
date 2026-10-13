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
        Schema::table('items', function (Blueprint $table) {
            if (!Schema::hasColumn('items', 'is_discount_rules')) {
                $table->boolean('is_discount_rules')->default(true)->after('is_tags')->comment('Control de visibilidad para reglas de descuento');
            }
            if (Schema::hasColumn('items', 'is_rules')) {
                $table->dropColumn('is_rules');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            if (Schema::hasColumn('items', 'is_discount_rules')) {
                $table->dropColumn('is_discount_rules');
            }
        });
    }
};
