<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('combos', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name'); // Nombre del combo (e.g., "Combo Estudiante")
            $table->decimal('price', 10, 2)->nullable(); // Precio del combo antes de descuento
            $table->decimal('discount', 10, 2)->default(0); // Descuento aplicado
            $table->decimal('final_price', 10, 2)->nullable(); // Precio final del combo después de descuento
            $table->decimal('discount_percent', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combos');
    }
};
