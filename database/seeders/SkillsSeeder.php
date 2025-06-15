<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillsSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            // Frontend
            ['name' => 'Vue.js', 'category' => 'Frontend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', 'is_featured' => true],
            ['name' => 'React', 'category' => 'Frontend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'is_featured' => true],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'],

            // Backend
            ['name' => 'Laravel', 'category' => 'Backend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg', 'is_featured' => true],
            ['name' => 'PHP', 'category' => 'Backend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 'is_featured' => true],
            ['name' => 'Node.js', 'category' => 'Backend', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'],

            // Machine Learning
            ['name' => 'Python', 'category' => 'Machine Learning', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 'is_featured' => true],
            ['name' => 'TensorFlow', 'category' => 'Machine Learning', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'],
            ['name' => 'Pandas', 'category' => 'Machine Learning', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg'],

            // Database
            ['name' => 'MySQL', 'category' => 'Database', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
            ['name' => 'PostgreSQL', 'category' => 'Database', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'],

            // Tools
            ['name' => 'Git', 'category' => 'Tools', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'],
            ['name' => 'Docker', 'category' => 'Tools', 'logo_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'],
        ];

        foreach ($skills as $index => $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => $skill['category'],
                'logo_url' => $skill['logo_url'],
                'sort_order' => $index,
                'is_featured' => $skill['is_featured'] ?? false,
                'is_active' => true,
            ]);
        }
    }
}
