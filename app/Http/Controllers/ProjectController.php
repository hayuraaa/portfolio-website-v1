<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('completed_at')
            ->paginate(4);

        return Inertia::render('Projects', [
            'projects' => $projects
        ]);
    }
}
