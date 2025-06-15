<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        // Get profile untuk navbar dan CV
        $profile = Profile::getActive();

        return Inertia::render('Contact', [
            'profile' => $profile,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        try {
            // Simpan contact ke database
            $contact = Contact::create($validated);

            // Debug: Log untuk memastikan data tersimpan

            // Return dengan Inertia redirect dan flash message
            return redirect()->route('contact')->with('success', 'Thank you for your message! I will get back to you soon.');
        } catch (\Exception $e) {
            // Log error jika ada masalah

            return redirect()->route('contact')->with('error', 'Sorry, there was an error sending your message. Please try again.');
        }
    }

    public function previewCv()
    {
        $profile = Profile::getActive();

        if (!$profile || !$profile->cv_file) {
            abort(404, 'CV file not found.');
        }

        $filePath = storage_path('app/public/' . $profile->cv_file);

        if (!file_exists($filePath)) {
            abort(404, 'CV file not found.');
        }

        // Return file dengan header untuk preview di browser
        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $profile->name . '_CV.pdf"'
        ]);
    }
}
