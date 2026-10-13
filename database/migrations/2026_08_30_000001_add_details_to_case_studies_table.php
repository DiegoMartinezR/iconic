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
        Schema::table('case_studies', function (Blueprint $table) {
            if (!Schema::hasColumn('case_studies', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('case_studies', 'summary')) {
                $table->text('summary')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('case_studies', 'challenge')) {
                $table->text('challenge')->nullable()->after('description');
            }
            if (!Schema::hasColumn('case_studies', 'solution')) {
                $table->text('solution')->nullable()->after('challenge');
            }
            if (!Schema::hasColumn('case_studies', 'indicators')) {
                $table->json('indicators')->nullable()->after('after');
            }
            if (!Schema::hasColumn('case_studies', 'strengths')) {
                $table->json('strengths')->nullable()->after('indicators');
            }
            if (!Schema::hasColumn('case_studies', 'steps')) {
                $table->json('steps')->nullable()->after('strengths');
            }
            if (!Schema::hasColumn('case_studies', 'faqs')) {
                $table->json('faqs')->nullable()->after('steps');
            }
            if (!Schema::hasColumn('case_studies', 'background_image')) {
                $table->string('background_image')->nullable()->after('image');
            }
            if (!Schema::hasColumn('case_studies', 'featured')) {
                $table->boolean('featured')->default(false)->after('visible');
            }
            if (!Schema::hasColumn('case_studies', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('background_image');
            }
            if (!Schema::hasColumn('case_studies', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('case_studies', 'meta_keywords')) {
                $table->text('meta_keywords')->nullable()->after('meta_description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $cols = array_filter([
                'slug', 'summary', 'challenge', 'solution',
                'indicators', 'strengths', 'steps', 'faqs',
                'background_image', 'meta_title', 'meta_description', 'meta_keywords'
            ], fn($c) => Schema::hasColumn('case_studies', $c));

            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
