<?php

use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\BlogController as ControllersBlogController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController as ControllersProjectController;
use App\Http\Controllers\SkillsController;
use App\Models\Profile;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $profile = Profile::getActive();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'profile' => $profile,
    ]);
});

Route::get('/skills', [SkillsController::class, 'index'])->name('skills');
Route::get('/projects', [ControllersProjectController::class, 'index'])->name('projects');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/contact/preview-cv', [ContactController::class, 'previewCv'])->name('contact.preview-cv');
Route::post('/api/chatbot', [ChatbotController::class, 'chat']);

// Blog Public Routes
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [ControllersBlogController::class, 'index'])->name('index');
    Route::get('/{slug}', [ControllersBlogController::class, 'show'])->name('show');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // Profile routes - Updated dengan create dan edit terpisah
    Route::get('/profile', [AdminProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/create', [AdminProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [AdminProfileController::class, 'store'])->name('profile.store');
    Route::get('/profile/edit', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [AdminProfileController::class, 'removeAvatar'])->name('profile.remove-avatar');
    Route::delete('/profile/cv', [AdminProfileController::class, 'removeCv'])->name('profile.remove-cv');

    // Skills routes
    Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');
    Route::get('/skills/create', [SkillController::class, 'create'])->name('skills.create');
    Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::get('/skills/{skill}/edit', [SkillController::class, 'edit'])->name('skills.edit');
    Route::put('/skills/{skill}', [SkillController::class, 'update'])->name('skills.update');
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');

    Route::patch('skills/{skill}/toggle-featured', [SkillController::class, 'toggleFeatured'])
        ->name('skills.toggle-featured');
    Route::patch('skills/{skill}/toggle-active', [SkillController::class, 'toggleActive'])
        ->name('skills.toggle-active');

    // Projects routes
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::patch('/projects/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured'])->name('projects.toggle-featured');
    Route::patch('/projects/{project}/toggle-active', [ProjectController::class, 'toggleActive'])->name('projects.toggle-active');

    // Blog routes
    Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
    Route::get('/blogs/create', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/blogs/{blog}', [BlogController::class, 'show'])->name('blogs.show');
    Route::get('/blogs/{blog}/edit', [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('/blogs/{blog}', [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy'])->name('blogs.destroy');

    // Additional blog actions
    Route::patch('/blogs/{blog}/toggle-featured', [BlogController::class, 'toggleFeatured'])->name('blogs.toggle-featured');
    Route::patch('/blogs/{blog}/change-status', [BlogController::class, 'changeStatus'])->name('blogs.change-status');
    Route::post('/blogs/{blog}/duplicate', [BlogController::class, 'duplicate'])->name('blogs.duplicate');

    // Contact routes
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/{contact}', [AdminContactController::class, 'show'])->name('contacts.show');
    Route::delete('/contacts/{contact}', [AdminContactController::class, 'destroy'])->name('contacts.destroy');

});

require __DIR__ . '/auth.php';
