<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_analytics', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->uuid('item_id');
            $table->unsignedBigInteger('user_id')->nullable(); // Cambiado a unsignedBigInteger para coincidir con users.id
            $table->string('session_id');
            $table->string('event_type');
            $table->string('device_type');
            $table->string('source')->nullable();
            $table->integer('time_spent')->default(0);
            $table->boolean('converted')->default(false);
            $table->timestamps();

            $table->foreign('item_id')
                  ->references('id')
                  ->on('items')
                  ->onDelete('cascade');

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_analytics');
    }
};
