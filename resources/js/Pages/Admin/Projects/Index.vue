<script setup>
import { ref, computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    projects: Array,
    categories: Array,
    projectsCount: Number,
    featuredCount: Number,
});

const selectedCategory = ref('all');
const searchQuery = ref('');

// Filter projects based on selected category and search
const filteredProjects = computed(() => {
    let result = props.projects;
    
    if (selectedCategory.value !== 'all') {
        result = result.filter(project => project.category === selectedCategory.value);
    }
    
    if (searchQuery.value) {
        result = result.filter(project =>
            project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    
    return result;
});

const toggleFeatured = (project) => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.projects.toggle-featured', project.id));
};

const toggleActive = (project) => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.projects.toggle-active', project.id));
};

const deleteProject = (project) => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.projects.destroy', project.id));
    }
};

// Generate image URL
const getImageUrl = (project) => {
    if (project.image_url) {
        return project.image_url;
    }
    return '/images/default-project.svg';
};

// Format date
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
};
</script>

<template>
    <Head title="Projects Management" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Projects Management</h2>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ projectsCount }} total projects, {{ featuredCount }} featured
                    </p>
                </div>
                <Link
                    :href="route('admin.projects.create')"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Project
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Filters -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div class="p-6">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <!-- Category Filter -->
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                                <select 
                                    v-model="selectedCategory"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="all">All Categories</option>
                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                            </div>
                            
                            <!-- Search -->
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
                                <input
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Search by title or description..."
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Projects Grid -->
                <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="project in filteredProjects"
                        :key="project.id"
                        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <!-- Project Image -->
                        <div class="relative h-48 bg-gray-200">
                            <img
                                :src="getImageUrl(project)"
                                :alt="project.title"
                                class="w-full h-full object-cover"
                                @error="(e) => e.target.src = '/images/default-project.svg'"
                            />
                            
                            <!-- Overlay badges -->
                            <div class="absolute top-3 left-3 flex space-x-2">
                                <span v-if="project.is_featured" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    ⭐ Featured
                                </span>
                                <span :class="[
                                    'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                                    project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ project.is_active ? '✅ Active' : '❌ Inactive' }}
                                </span>
                            </div>

                            <!-- Actions dropdown -->
                            <div class="absolute top-3 right-3">
                                <div class="relative group">
                                    <button class="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full">
                                        <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"/>
                                        </svg>
                                    </button>
                                    
                                    <div class="absolute right-0 top-10 w-40 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                        <Link
                                            :href="route('admin.projects.show', project.id)"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            👁️ View Details
                                        </Link>
                                        <Link
                                            :href="route('admin.projects.edit', project.id)"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            @click="toggleFeatured(project)"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {{ project.is_featured ? '⭐ Unfeature' : '⭐ Feature' }}
                                        </button>
                                        <button
                                            @click="toggleActive(project)"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {{ project.is_active ? '❌ Deactivate' : '✅ Activate' }}
                                        </button>
                                        <hr class="my-1">
                                        <button
                                            @click="deleteProject(project)"
                                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Project Content -->
                        <div class="p-6">
                            <!-- Title and Category -->
                            <div class="mb-3">
                                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ project.title }}</h3>
                                <div class="flex items-center justify-between">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ project.category }}
                                    </span>
                                    <span class="text-sm text-gray-500">{{ formatDate(project.completed_at) }}</span>
                                </div>
                            </div>

                            <!-- Description -->
                            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                                {{ project.description }}
                            </p>

                            <!-- Technologies -->
                            <div v-if="project.technologies && project.technologies.length > 0" class="mb-4">
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="tech in project.technologies.slice(0, 3)"
                                        :key="tech"
                                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                    >
                                        {{ tech }}
                                    </span>
                                    <span v-if="project.technologies.length > 3" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500">
                                        +{{ project.technologies.length - 3 }} more
                                    </span>
                                </div>
                            </div>

                            <!-- Links -->
                            <div class="flex space-x-3">
                                <a
                                    v-if="project.demo_url"
                                    :href="project.demo_url"
                                    target="_blank"
                                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-3 rounded text-sm font-medium"
                                >
                                    🚀 Demo
                                </a>
                                <a
                                    v-if="project.github_url"
                                    :href="project.github_url"
                                    target="_blank"
                                    class="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-center py-2 px-3 rounded text-sm font-medium"
                                >
                                    📦 Code
                                </a>
                                <Link
                                    :href="route('admin.projects.edit', project.id)"
                                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-center py-2 px-3 rounded text-sm font-medium"
                                >
                                    ✏️ Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-12 text-center">
                        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                        <p class="mt-2 text-gray-500">
                            {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first project.' }}
                        </p>
                        <div class="mt-6">
                            <Link
                                :href="route('admin.projects.create')"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Your First Project
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>