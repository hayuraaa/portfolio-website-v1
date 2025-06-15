<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    project: Object,
});

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
        month: 'long',
        day: 'numeric'
    });
};
</script>

<template>
    <Head :title="project.title" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ project.title }}</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ project.category }}</p>
                </div>
                <div class="flex space-x-3">
                    <Link
                        :href="route('admin.projects.edit', project.id)"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit Project
                    </Link>
                    <Link
                        :href="route('admin.projects.index')"
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <!-- Status Badges -->
                <div class="flex space-x-3 mb-6">
                    <span v-if="project.is_featured" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Featured Project
                    </span>
                    <span :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                        project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]">
                        {{ project.is_active ? '✅ Active' : '❌ Inactive' }}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {{ project.category }}
                    </span>
                </div>

                <!-- Main Content -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <!-- Hero Image -->
                    <div class="h-64 md:h-80 bg-gray-200">
                        <img
                            :src="getImageUrl(project)"
                            :alt="project.title"
                            class="w-full h-full object-cover"
                            @error="(e) => e.target.src = '/images/default-project.svg'"
                        />
                    </div>

                    <div class="p-6">
                        <!-- Project Info -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Main Content -->
                            <div class="lg:col-span-2">
                                <!-- Description -->
                                <div class="mb-8">
                                    <h3 class="text-lg font-medium text-gray-900 mb-3">Description</h3>
                                    <p class="text-gray-700 leading-relaxed">{{ project.description }}</p>
                                </div>

                                <!-- Features -->
                                <div v-if="project.features" class="mb-8">
                                    <h3 class="text-lg font-medium text-gray-900 mb-3">Key Features</h3>
                                    <div class="bg-gray-50 rounded-lg p-4">
                                        <pre class="whitespace-pre-wrap text-gray-700 text-sm">{{ project.features }}</pre>
                                    </div>
                                </div>

                                <!-- Technologies -->
                                <div v-if="project.technologies && project.technologies.length > 0" class="mb-8">
                                    <h3 class="text-lg font-medium text-gray-900 mb-3">Technologies Used</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <span
                                            v-for="tech in project.technologies"
                                            :key="tech"
                                            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {{ tech }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Gallery -->
                                <div v-if="project.gallery_urls && project.gallery_urls.length > 0" class="mb-8">
                                    <h3 class="text-lg font-medium text-gray-900 mb-3">Gallery</h3>
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <img
                                            v-for="(imageUrl, index) in project.gallery_urls"
                                            :key="index"
                                            :src="imageUrl"
                                            :alt="`${project.title} gallery ${index + 1}`"
                                            class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Sidebar -->
                            <div class="lg:col-span-1">
                                <!-- Project Links -->
                                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Links</h3>
                                    <div class="space-y-3">
                                        <a
                                            v-if="project.demo_url"
                                            :href="project.demo_url"
                                            target="_blank"
                                            class="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium"
                                        >
                                            🚀 View Live Demo
                                        </a>
                                        <a
                                            v-if="project.github_url"
                                            :href="project.github_url"
                                            target="_blank"
                                            class="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium"
                                        >
                                            📦 View Source Code
                                        </a>
                                    </div>
                                </div>

                                <!-- Project Details -->
                                <div class="bg-gray-50 rounded-lg p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                                    <dl class="space-y-3">
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Category</dt>
                                            <dd class="text-sm text-gray-900">{{ project.category }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Completed</dt>
                                            <dd class="text-sm text-gray-900">{{ formatDate(project.completed_at) }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Sort Order</dt>
                                            <dd class="text-sm text-gray-900">{{ project.sort_order }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Status</dt>
                                            <dd class="text-sm text-gray-900">
                                                <span :class="[
                                                    'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                                                    project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                ]">
                                                    {{ project.is_active ? 'Active' : 'Inactive' }}
                                                </span>
                                            </dd>
                                        </div>
                                        <div v-if="project.is_featured">
                                            <dt class="text-sm font-medium text-gray-500">Featured</dt>
                                            <dd class="text-sm text-gray-900">
                                                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    ⭐ Featured
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>