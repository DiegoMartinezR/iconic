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
        Schema::table('users', function (Blueprint $table) {
            // Ubicación del usuario
            $table->string('department')->nullable();
            $table->string('province')->nullable();
            $table->string('district')->nullable();
            $table->string('ubigeo')->nullable();
            //  $table->string('address')->nullable(); // Calle o avenida
            $table->string('number')->nullable(); // Número de casa o apto.
            $table->text('reference')->nullable(); // Información extra

            // Contacto adicional
            $table->string('alternate_phone')->nullable(); // Teléfono alternativo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
