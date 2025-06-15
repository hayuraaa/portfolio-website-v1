<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::query();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('excerpt', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'published_at') {
            $query->orderByRaw('published_at IS NULL, published_at ' . $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $blogs = $query->paginate(12)->withQueryString();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => Blog::getCategories(),
            'statuses' => Blog::getStatuses(),
            'filters' => $request->only(['status', 'category', 'search', 'sort_by', 'sort_order']),
            'stats' => [
                'total' => Blog::count(),
                'published' => Blog::published()->count(),
                'draft' => Blog::draft()->count(),
                'featured' => Blog::featured()->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blogs/Create', [
            'categories' => Blog::getCategories(),
            'statuses' => Blog::getStatuses(),
            'popularTags' => Blog::getPopularTags(15),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'category' => ['required', 'string', Rule::in(Blog::getCategories())],
            'status' => ['required', 'string', Rule::in(array_keys(Blog::getStatuses()))],
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array',
            'meta_keywords.*' => 'string|max:50',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blogs', 'public');
        }

        // Set defaults
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_featured'] = $validated['is_featured'] ?? false;

        // Clean up tags and meta_keywords
        if (isset($validated['tags'])) {
            $validated['tags'] = array_filter(array_map('trim', $validated['tags']));
        }
        if (isset($validated['meta_keywords'])) {
            $validated['meta_keywords'] = array_filter(array_map('trim', $validated['meta_keywords']));
        }

        $blog = Blog::create($validated);

        return redirect()->route('admin.blogs.index')
            ->with('message', 'Blog post created successfully!');
    }

    public function show(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $blog->getRelatedBlogs(),
        ]);
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $blog,
            'categories' => Blog::getCategories(),
            'statuses' => Blog::getStatuses(),
            'popularTags' => Blog::getPopularTags(15),
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'category' => ['required', 'string', Rule::in(Blog::getCategories())],
            'status' => ['required', 'string', Rule::in(array_keys(Blog::getStatuses()))],
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array',
            'meta_keywords.*' => 'string|max:50',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists and is local file
            if ($blog->featured_image && !filter_var($blog->featured_image, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($blog->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('blogs', 'public');
        } else {
            // Don't overwrite existing image
            unset($validated['featured_image']);
        }

        // Clean up tags and meta_keywords
        if (isset($validated['tags'])) {
            $validated['tags'] = array_filter(array_map('trim', $validated['tags']));
        }
        if (isset($validated['meta_keywords'])) {
            $validated['meta_keywords'] = array_filter(array_map('trim', $validated['meta_keywords']));
        }

        $blog->update($validated);

        return redirect()->route('admin.blogs.index')
            ->with('message', 'Blog post updated successfully!');
    }

    public function destroy(Blog $blog)
    {
        // Delete featured image if exists and is local file
        if ($blog->featured_image && !filter_var($blog->featured_image, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($blog->featured_image);
        }

        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('message', 'Blog post deleted successfully!');
    }

    // Toggle featured status
    public function toggleFeatured(Blog $blog)
    {
        $blog->update([
            'is_featured' => !$blog->is_featured
        ]);

        return back()->with('message', 'Blog featured status updated!');
    }

    // Change status (draft/published/archived)
    public function changeStatus(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(array_keys(Blog::getStatuses()))]
        ]);

        $blog->update($validated);

        return back()->with('message', 'Blog status updated to ' . $blog->status_label . '!');
    }

    // Duplicate blog
    public function duplicate(Blog $blog)
    {
        $newBlog = $blog->replicate();
        $newBlog->title = $blog->title . ' (Copy)';
        $newBlog->slug = null; // Will be auto-generated
        $newBlog->status = 'draft';
        $newBlog->is_featured = false;
        $newBlog->published_at = null;
        $newBlog->views_count = 0;
        $newBlog->save();

        return redirect()->route('admin.blogs.edit', $newBlog)
            ->with('message', 'Blog post duplicated successfully!');
    }

    // Quick stats for dashboard
    public function stats()
    {
        return response()->json([
            'total_blogs' => Blog::count(),
            'published_blogs' => Blog::published()->count(),
            'draft_blogs' => Blog::draft()->count(),
            'total_views' => Blog::sum('views_count'),
            'recent_blogs' => Blog::recent(5)->get(['id', 'title', 'published_at', 'views_count']),
            'popular_blogs' => Blog::popular(5)->get(['id', 'title', 'views_count']),
        ]);
    }
}
