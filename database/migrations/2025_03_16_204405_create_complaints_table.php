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
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('nombre');
            $table->string('tipo_documento');
            $table->string('numero_identidad');
            $table->string('celular')->nullable();
            $table->string('correo_electronico');
            $table->string('departamento');
            $table->string('provincia');
            $table->string('distrito');
            $table->string('direccion');
            $table->string('tipo_producto');
            $table->decimal('monto_reclamado', 10, 2)->nullable();
            $table->text('descripcion_producto');
            $table->string('tipo_reclamo');
            $table->date('fecha_ocurrencia')->nullable();
            $table->string('numero_pedido')->nullable();
            $table->text('detalle_reclamo');
            $table->boolean('acepta_terminos');
            $table->text('recaptcha_token');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
