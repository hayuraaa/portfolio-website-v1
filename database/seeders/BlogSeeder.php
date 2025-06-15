<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $blogs = [
            [
                'title' => 'Getting Started with Laravel 11',
                'excerpt' => 'Learn the basics of Laravel 11 and build your first web application.',
                'content' => '<p>Laravel 11 brings exciting new features and improvements. In this tutorial, we\'ll explore the key changes and build a simple application.</p><h2>What\'s New in Laravel 11</h2><p>Laravel 11 introduces several new features...</p>',
                'category' => 'Web Development',
                'status' => 'published',
                'is_featured' => true,
                'tags' => ['Laravel', 'PHP', 'Web Development', 'Tutorial'],
                'published_at' => Carbon::now()->subDays(5),
                'views_count' => 150,
            ],
            [
                'title' => 'Vue.js 3 Composition API Deep Dive',
                'excerpt' => 'Master the Vue.js 3 Composition API with practical examples and best practices.',
                'content' => '<p>The Composition API is one of the most significant additions to Vue.js 3. Let\'s explore how to use it effectively.</p><h2>Setting Up</h2><p>First, let\'s set up a Vue 3 project...</p>',
                'category' => 'Web Development',
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['Vue.js', 'JavaScript', 'Frontend', 'Tutorial'],
                'published_at' => Carbon::now()->subDays(10),
                'views_count' => 89,
            ],
            [
                'title' => 'Machine Learning with Python: A Beginner\'s Guide',
                'excerpt' => 'Start your machine learning journey with Python and scikit-learn.',
                'content' => '<p>Machine learning doesn\'t have to be intimidating. In this guide, we\'ll start with the basics and build our first ML model.</p><h2>Prerequisites</h2><p>You\'ll need Python and a few libraries...</p>',
                'category' => 'Machine Learning',
                'status' => 'published',
                'is_featured' => true,
                'tags' => ['Python', 'Machine Learning', 'Data Science', 'Beginner'],
                'published_at' => Carbon::now()->subDays(3),
                'views_count' => 203,
            ],
            [
                'title' => 'Building APIs with Node.js and Express',
                'excerpt' => 'Create robust RESTful APIs using Node.js and Express framework.',
                'content' => '<p>APIs are the backbone of modern web applications. Let\'s learn how to build them with Node.js and Express.</p>',
                'category' => 'Web Development',
                'status' => 'draft',
                'is_featured' => false,
                'tags' => ['Node.js', 'Express', 'API', 'Backend'],
                'published_at' => null,
                'views_count' => 0,
            ],
            [
                'title' => 'DevOps Best Practices for Small Teams',
                'excerpt' => 'Implement DevOps practices that work for small development teams.',
                'content' => '<p>DevOps doesn\'t require a large team or expensive tools. Here are practical approaches for small teams.</p>',
                'category' => 'DevOps',
                'status' => 'published',
                'is_featured' => false,
                'tags' => ['DevOps', 'CI/CD', 'Docker', 'Best Practices'],
                'published_at' => Carbon::now()->subDays(7),
                'views_count' => 127,
            ],
        ];

        foreach ($blogs as $blogData) {
            Blog::create($blogData);
        }
    }
}
