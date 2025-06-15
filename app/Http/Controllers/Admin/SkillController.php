<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        $categories = [
            'Frontend',
            'Backend',
            'Database',
            'Machine Learning',
            'DevOps',
            'Mobile',
            'Tools',
            'Other'
        ];

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
            'categories' => $categories,
            'skillsCount' => Skill::count(),
            'featuredCount' => Skill::featured()->count(),
        ]);
    }

    public function create()
    {
        $categories = [
            'Frontend',
            'Backend',
            'Database',
            'Machine Learning',
            'DevOps',
            'Mobile',
            'Tools',
            'Other'
        ];

        return Inertia::render('Admin/Skills/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|url',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo_file')) {
            $validated['logo_url'] = $request->file('logo_file')->store('skills', 'public');
        }

        // Set defaults
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;

        Skill::create($validated);

        return redirect()->route('admin.skills.index')
            ->with('message', 'Skill created successfully!');
    }

    public function edit(Skill $skill)
    {
        $categories = [
            'Frontend',
            'Backend',
            'Database',
            'Machine Learning',
            'DevOps',
            'Mobile',
            'Tools',
            'Other'
        ];

        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $skill,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|url',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo_file')) {
            // Delete old logo if exists
            if ($skill->logo_url && strpos($skill->logo_url, 'skills/') !== false) {
                Storage::disk('public')->delete($skill->logo_url);
            }
            $validated['logo_url'] = $request->file('logo_file')->store('skills', 'public');
        }

        $skill->update($validated);

        return redirect()->route('admin.skills.index')
            ->with('message', 'Skill updated successfully!');
    }

    public function destroy(Skill $skill)
    {
        // Delete logo file if exists
        if ($skill->logo_url && strpos($skill->logo_url, 'skills/') !== false) {
            Storage::disk('public')->delete($skill->logo_url);
        }

        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('message', 'Skill deleted successfully!');
    }

    // Toggle featured status
    public function toggleFeatured(Skill $skill)
    {
        $skill->update([
            'is_featured' => !$skill->is_featured
        ]);

        return back()->with('message', 'Skill featured status updated!');
    }

    // Toggle active status
    public function toggleActive(Skill $skill)
    {
        $skill->update([
            'is_active' => !$skill->is_active
        ]);

        return back()->with('message', 'Skill status updated!');
    }
}
