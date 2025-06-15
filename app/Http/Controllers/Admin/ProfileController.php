<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::getActive();
        $hasProfile = $profile ? true : false;

        // Debug untuk troubleshooting avatar
        $debug = null;
        if ($profile && $profile->avatar) {
            $debug = [
                'avatar_path' => $profile->avatar,
                'avatar_url' => asset('storage/' . $profile->avatar),
                'avatar_exists' => Storage::disk('public')->exists($profile->avatar),
            ];
        }

        return Inertia::render('Admin/Profile/Index', [
            'profile' => $profile,
            'hasProfile' => $hasProfile,
            'debug' => $debug
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Profile/Create');
    }

    public function edit()
    {
        $profile = Profile::getActive();

        if (!$profile) {
            return redirect()->route('admin.profile.create')
                ->with('message', 'Please create a profile first.');
        }

        // Debug untuk troubleshooting avatar
        $debug = null;
        if ($profile && $profile->avatar) {
            $debug = [
                'avatar_path' => $profile->avatar,
                'avatar_url' => asset('storage/' . $profile->avatar),
                'avatar_exists' => Storage::disk('public')->exists($profile->avatar),
            ];
        }

        return Inertia::render('Admin/Profile/Edit', [
            'profile' => $profile,
            'debug' => $debug
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'bio' => 'required|string',
            'description' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cv_file' => 'nullable|mimes:pdf|max:5120',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'website_url' => 'nullable|url',
        ]);

        // Handle file uploads
        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->hasFile('cv_file')) {
            $validated['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        }

        // Set as active
        $validated['is_active'] = true;

        // Deactivate other profiles first
        Profile::where('is_active', true)->update(['is_active' => false]);

        $profile = Profile::create($validated);

        return redirect()->route('admin.profile.index')
            ->with('message', 'Profile created successfully!');
    }

    public function update(Request $request)
    {
        $profile = Profile::getActive();

        if (!$profile) {
            return redirect()->route('admin.profile.create')
                ->with('error', 'No active profile found. Please create a profile first.');
        }

        // Validate all fields
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'bio' => 'required|string',
            'description' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cv_file' => 'nullable|mimes:pdf|max:5120',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'website_url' => 'nullable|url',
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profile->avatar && Storage::disk('public')->exists($profile->avatar)) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        } else {
            // PENTING: Hapus dari array validated agar tidak overwrite
            unset($validated['avatar']);
        }

        // Handle CV upload
        if ($request->hasFile('cv_file')) {
            // Delete old CV if exists
            if ($profile->cv_file && Storage::disk('public')->exists($profile->cv_file)) {
                Storage::disk('public')->delete($profile->cv_file);
            }
            $validated['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        } else {
            // PENTING: Hapus dari array validated agar tidak overwrite
            unset($validated['cv_file']);
        }

        // Update only the provided fields
        $profile->update($validated);

        return redirect()->route('admin.profile.index')
            ->with('message', 'Profile updated successfully!');
    }

    public function removeAvatar()
    {
        $profile = Profile::getActive();

        if ($profile && $profile->avatar) {
            if (Storage::disk('public')->exists($profile->avatar)) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $profile->update(['avatar' => null]);
        }

        return redirect()->back()
            ->with('message', 'Avatar removed successfully!');
    }

    public function removeCv()
    {
        $profile = Profile::getActive();

        if ($profile && $profile->cv_file) {
            if (Storage::disk('public')->exists($profile->cv_file)) {
                Storage::disk('public')->delete($profile->cv_file);
            }
            $profile->update(['cv_file' => null]);
        }

        return redirect()->back()
            ->with('message', 'CV removed successfully!');
    }
}
