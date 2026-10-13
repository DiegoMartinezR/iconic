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
        Schema::table('projects', function (Blueprint $table) {
            $table->text('challenge')->nullable();
            $table->text('solution')->nullable();
            $table->string('website_url')->nullable();
            $table->string('video_url')->nullable();
            
            $table->json('indicators')->nullable();
            $table->json('strengths')->nullable();
            $table->json('steps')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'challenge',
                'solution',
                'website_url',
                'video_url',
                'indicators',
                'strengths',
                'steps'
            ]);
        });
    }
};
