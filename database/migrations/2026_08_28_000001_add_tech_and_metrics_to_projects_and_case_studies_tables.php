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
            if (!Schema::hasColumn('projects', 'tech')) {
                $table->json('tech')->nullable()->after('client');
            }
            if (!Schema::hasColumn('projects', 'metrics')) {
                $table->string('metrics')->nullable()->after('tech');
            }
        });

        Schema::table('case_studies', function (Blueprint $table) {
            if (!Schema::hasColumn('case_studies', 'client')) {
                $table->string('client')->nullable()->after('name');
            }
            if (!Schema::hasColumn('case_studies', 'impact')) {
                $table->string('impact')->nullable()->after('client');
            }
            if (!Schema::hasColumn('case_studies', 'before')) {
                $table->text('before')->nullable()->after('impact');
            }
            if (!Schema::hasColumn('case_studies', 'after')) {
                $table->text('after')->nullable()->after('before');
            }
            if (!Schema::hasColumn('case_studies', 'author')) {
                $table->string('author')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'tech')) {
                $table->dropColumn('tech');
            }
            if (Schema::hasColumn('projects', 'metrics')) {
                $table->dropColumn('metrics');
            }
        });

        Schema::table('case_studies', function (Blueprint $table) {
            $cols = array_filter(['client', 'impact', 'before', 'after', 'author'], fn($c) => Schema::hasColumn('case_studies', $c));
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
