<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enlace oficial de afiliación (compra nacional) del producto.
     */
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->string('affiliate_url')->nullable()->after('url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('affiliate_url');
        });
    }
};
