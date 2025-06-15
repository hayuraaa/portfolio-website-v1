<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('sort_order')
            ->orderBy('completed_at', 'desc')
            ->get();

        $categories = Project::getCategories();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'categories' => $categories,
            'projectsCount' => Project::count(),
            'featuredCount' => Project::featured()->count(),
        ]);
    }

    public function create()
    {
        $categories = Project::getCategories();
        $skills = Skill::active()->orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Projects/Create', [
            'categories' => $categories,
            'skills' => $skills,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'completed_at' => 'nullable|date',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('projects/gallery', 'public');
            }
            $validated['gallery'] = $galleryPaths;
        }

        // Set defaults
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['completed_at'] = $validated['completed_at'] ?? now();

        Project::create($validated);

        return redirect()->route('admin.projects.index')
            ->with('message', 'Project created successfully!');
    }

    public function show(Project $project)
    {
        return Inertia::render('Admin/Projects/Show', [
            'project' => $project
        ]);
    }

    public function edit(Project $project)
    {
        $categories = Project::getCategories();
        $skills = Skill::active()->orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
            'categories' => $categories,
            'skills' => $skills,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        // Debug jika diperlukan
        // dd($request->method(), $request->all()); // Uncomment untuk debug

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'completed_at' => 'nullable|date',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle main image upload
        if ($request->hasFile('image')) {
            // Delete old image jika bukan URL eksternal
            if ($project->image && !filter_var($project->image, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($project->image);
            }
            $validated['image'] = $request->file('image')->store('projects', 'public');
        } else {
            // PENTING: Jangan overwrite image yang sudah ada jika tidak ada file baru
            unset($validated['image']);
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery')) {
            // Delete old gallery images jika bukan URL eksternal
            if ($project->gallery) {
                foreach ($project->gallery as $path) {
                    if (!filter_var($path, FILTER_VALIDATE_URL)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('projects/gallery', 'public');
            }
            $validated['gallery'] = $galleryPaths;
        } else {
            // PENTING: Jangan overwrite gallery yang sudah ada jika tidak ada file baru
            unset($validated['gallery']);
        }

        $project->update($validated);

        return redirect()->route('admin.projects.index')
            ->with('message', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        // Delete main image
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        // Delete gallery images
        if ($project->gallery) {
            foreach ($project->gallery as $path) {
                Storage::disk('public')->delete($path);
            }
        }

        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('message', 'Project deleted successfully!');
    }

    // Toggle featured status
    public function toggleFeatured(Project $project)
    {
        $project->update([
            'is_featured' => !$project->is_featured
        ]);

        return back()->with('message', 'Project featured status updated!');
    }

    // Toggle active status
    public function toggleActive(Project $project)
    {
        $project->update([
            'is_active' => !$project->is_active
        ]);

        return back()->with('message', 'Project status updated!');
    }
}
