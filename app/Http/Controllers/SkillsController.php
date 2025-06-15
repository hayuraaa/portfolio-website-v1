<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\Profile;
use Inertia\Inertia;

class SkillsController extends Controller
{
    public function index()
    {
        // Get active profile
        $profile = Profile::getActive();

        // Get skills grouped by category, only active ones
        $skillsGrouped = Skill::active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        // Get featured skills
        $featuredSkills = Skill::getFeatured();

        return Inertia::render('Skills', [
            'profile' => $profile,
            'skillsGrouped' => $skillsGrouped,
            'featuredSkills' => $featuredSkills,
            'totalSkills' => Skill::active()->count(),
        ]);
    }
}
