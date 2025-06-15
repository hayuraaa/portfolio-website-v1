<script setup>
import { computed, onMounted } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    profile: Object,
    hasProfile: Boolean,
    debug: Object,
});

// Debug di console browser
onMounted(() => {
    console.log('Profile data:', props.profile);
    console.log('Debug data:', props.debug);
    console.log('Avatar URL:', props.profile?.avatar_url);
});

const handleImageError = (event) => {
    console.log('Image error occurred:', event.target.src);
    console.log('Switching to default avatar');
    event.target.src = '/images/default-avatar.svg';
};

const avatarUrl = computed(() => {
    if (props.profile?.avatar) {
        return `/storage/${props.profile.avatar}`;
    }
    return '/images/default-avatar.svg';
});
</script>

<template>
    <Head title="Profile" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
                <div class="flex items-center space-x-2">
                    <Link
                        v-if="!hasProfile"
                        :href="route('admin.profile.create')"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Profile
                    </Link>
                    <Link
                        v-if="hasProfile"
                        :href="route('admin.profile.edit')"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Debug info - untuk debugging avatar -->
                <div v-if="debug" class="bg-yellow-100 p-4 mb-4 rounded">
                    <h3 class="font-bold">Debug Info:</h3>
                    <p><strong>Avatar Path:</strong> {{ debug.avatar_path }}</p>
                    <p><strong>Avatar URL:</strong> {{ debug.avatar_url }}</p>
                    <p><strong>Profile Avatar URL:</strong> {{ profile?.avatar_url }}</p>
                </div>

                <!-- No Profile State -->
                <div v-if="!hasProfile" class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-center">
                        <div class="mb-4">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
                        <p class="text-gray-500 mb-4">You haven't created a profile yet. Create one to get started.</p>
                        <Link
                            :href="route('admin.profile.create')"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Profile
                        </Link>
                    </div>
                </div>

                <!-- Profile Display -->
                <div v-if="hasProfile" class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <!-- Header Section with Avatar -->
                        <div class="flex items-start space-x-6 mb-8">
                            <div class="flex-shrink-0">
                                <img
                                    :src="avatarUrl"
                                    :alt="profile?.name || 'Avatar'"
                                    class="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                                    @error="handleImageError"
                                    @load="(e) => console.log('Avatar loaded:', e.target.src)"
                                />
                            </div>
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold text-gray-900">{{ profile?.name }}</h1>
                                <p class="text-xl text-gray-600 mt-1">{{ profile?.title }}</p>
                                <p class="text-gray-500 mt-2">{{ profile?.bio }}</p>
                                <div class="flex items-center space-x-4 mt-4">
                                    <span class="text-sm text-gray-500">📧 {{ profile?.email }}</span>
                                    <span v-if="profile?.phone" class="text-sm text-gray-500">📞 {{ profile?.phone }}</span>
                                    <span v-if="profile?.location" class="text-sm text-gray-500">📍 {{ profile?.location }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="mb-8" v-if="profile?.description">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">About</h3>
                            <p class="text-gray-700 leading-relaxed">{{ profile?.description }}</p>
                        </div>

                        <!-- Social Links -->
                        <div class="mb-8" v-if="profile?.github_url || profile?.linkedin_url || profile?.twitter_url || profile?.instagram_url || profile?.website_url">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Social Links</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <a v-if="profile?.github_url" :href="profile.github_url" target="_blank" 
                                   class="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                    <span>GitHub</span>
                                </a>
                                
                                <a v-if="profile?.linkedin_url" :href="profile.linkedin_url" target="_blank"
                                   class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span>LinkedIn</span>
                                </a>

                                <a v-if="profile?.twitter_url" :href="profile.twitter_url" target="_blank"
                                   class="flex items-center space-x-2 text-gray-600 hover:text-blue-400">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                    <span>Twitter</span>
                                </a>

                                <a v-if="profile?.instagram_url" :href="profile.instagram_url" target="_blank"
                                   class="flex items-center space-x-2 text-gray-600 hover:text-pink-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span>Instagram</span>
                                </a>

                                <a v-if="profile?.website_url" :href="profile.website_url" target="_blank"
                                   class="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                    </svg>
                                    <span>Website</span>
                                </a>
                            </div>
                        </div>

                        <!-- CV Download -->
                        <div v-if="profile?.cv_file" class="mb-8">
                            <h3 class="text-lg font-medium text-gray-900 mb-3">Resume/CV</h3>
                            <a :href="`/storage/${profile.cv_file}`" target="_blank" 
                               class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download CV
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>