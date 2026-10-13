<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds `content_blocks` — un campo JSON para el editor BlockNote.js.
     * Coexiste con `description` (Quill). Para servicios tipo landing page avanzada.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('content_blocks')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('content_blocks');
        });
    }
};
