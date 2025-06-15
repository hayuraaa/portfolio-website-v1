<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::published();

        // Sort
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $blogs = $query->paginate(4)->withQueryString();

        // Get profile untuk navbar
        $profile = Profile::getActive();

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'profile' => $profile,
        ]);
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Increment views
        $blog->incrementViews();

        // Get profile untuk navbar
        $profile = Profile::getActive();

        // Get related blogs
        $relatedBlogs = $blog->getRelatedBlogs(3);

        // Get next and previous blogs
        $nextBlog = Blog::published()
            ->where('published_at', '>', $blog->published_at)
            ->orderBy('published_at', 'asc')
            ->first(['id', 'title', 'slug']);

        $previousBlog = Blog::published()
            ->where('published_at', '<', $blog->published_at)
            ->orderBy('published_at', 'desc')
            ->first(['id', 'title', 'slug']);

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'profile' => $profile,
            'relatedBlogs' => $relatedBlogs,
            'nextBlog' => $nextBlog,
            'previousBlog' => $previousBlog,
        ]);
    }
}
