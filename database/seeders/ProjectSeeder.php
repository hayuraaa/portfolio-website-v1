<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $projects = [
            [
                'title' => 'Portfolio Website',
                'description' => 'A personal portfolio website built with Laravel, Vue.js, and Tailwind CSS.',
                'features' => 'Responsive design, project showcase, contact form',
                'category' => 'Portfolio/Landing',
                'image' => 'projects/portfolio.jpg',
                'gallery' => ['projects/gallery/portfolio-1.jpg', 'projects/gallery/portfolio-2.jpg'],
                'technologies' => ['Laravel', 'Vue.js', 'Tailwind CSS'],
                'demo_url' => 'https://portfolio.example.com',
                'github_url' => 'https://github.com/username/portfolio',
                'completed_at' => now()->subMonths(2),
                'sort_order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'E-Commerce Platform',
                'description' => 'A scalable e-commerce platform with cart, payment gateway, and admin dashboard.',
                'features' => 'Product listing, shopping cart, admin panel',
                'category' => 'E-commerce',
                'image' => 'projects/ecommerce.jpg',
                'gallery' => ['projects/gallery/ecommerce-1.jpg', 'projects/gallery/ecommerce-2.jpg'],
                'technologies' => ['Laravel', 'Livewire', 'MySQL'],
                'demo_url' => 'https://shop.example.com',
                'github_url' => 'https://github.com/username/ecommerce',
                'completed_at' => now()->subMonths(4),
                'sort_order' => 2,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'AI Classifier App',
                'description' => 'A machine learning web app for classifying images using a CNN model.',
                'features' => 'Image upload, real-time prediction, model accuracy stats',
                'category' => 'Machine Learning',
                'image' => 'projects/ai-classifier.jpg',
                'gallery' => ['projects/gallery/ai-1.jpg'],
                'technologies' => ['Python', 'Flask', 'TensorFlow', 'Vue.js'],
                'demo_url' => 'https://ml-app.example.com',
                'github_url' => 'https://github.com/username/ml-classifier',
                'completed_at' => now()->subMonths(6),
                'sort_order' => 3,
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($projects as $project) {
            Project::create(array_merge($project, [
                'slug' => Str::slug($project['title']),
            ]));
        }
    }
}
