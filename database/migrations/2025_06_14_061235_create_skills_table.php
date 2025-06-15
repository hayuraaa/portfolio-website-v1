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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Laravel, React, Python, etc
            $table->string('category'); // Backend, Frontend, ML, Database, etc
            $table->string('logo_url')->nullable(); // Path to tech logo
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false); // For highlighting main skills
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
