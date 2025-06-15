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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('features')->nullable(); // JSON or text
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Multiple images
            $table->json('technologies')->nullable(); // Tech stack used
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('category'); // Web App, Mobile, ML Project, etc
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->date('completed_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
