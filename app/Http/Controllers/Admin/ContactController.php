<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::query();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('subject', 'like', '%' . $request->search . '%')
                    ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $contacts = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
            'stats' => [
                'total' => Contact::count(),
                'today' => Contact::whereDate('created_at', today())->count(),
                'this_week' => Contact::where('created_at', '>=', now()->startOfWeek())->count(),
                'this_month' => Contact::where('created_at', '>=', now()->startOfMonth())->count(),
            ]
        ]);
    }

    public function show(Contact $contact)
    {
        return Inertia::render('Admin/Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')
            ->with('message', 'Contact message deleted successfully!');
    }
}
