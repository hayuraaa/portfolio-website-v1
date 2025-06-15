<script setup>
import { ref, computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    skills: Object,
    categories: Array,
    skillsCount: Number,
    featuredCount: Number,
});

const selectedCategory = ref('all');
const searchQuery = ref('');

// Filter skills based on selected category and search
const filteredSkills = computed(() => {
    let result = props.skills;
    
    if (selectedCategory.value !== 'all') {
        result = { [selectedCategory.value]: props.skills[selectedCategory.value] || [] };
    }
    
    if (searchQuery.value) {
        const filtered = {};
        Object.keys(result).forEach(category => {
            const filteredCategorySkills = result[category].filter(skill =>
                skill.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
            if (filteredCategorySkills.length > 0) {
                filtered[category] = filteredCategorySkills;
            }
        });
        result = filtered;
    }
    
    return result;
});

const toggleFeatured = (skill) => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.skills.toggle-featured', skill.id));
};

const toggleActive = (skill) => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.skills.toggle-active', skill.id));
};

const deleteSkill = (skill) => {
    if (confirm(`Are you sure you want to delete "${skill.name}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.skills.destroy', skill.id));
    }
};

// Generate logo URL
const getLogoUrl = (skill) => {
    if (skill.logo_url) {
        if (skill.logo_url.startsWith('http')) {
            return skill.logo_url;
        }
        return `/storage/${skill.logo_url}`;
    }
    return '/images/default-tech-logo.svg';
};
</script>

<template>
    <Head title="Skills Management" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Skills Management</h2>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ skillsCount }} total skills, {{ featuredCount }} featured
                    </p>
                </div>
                <Link
                    :href="route('admin.skills.create')"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Skill
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
                                <label class="block text-sm font-medium text-gray-700 mb-2">Search Skills</label>
                                <input
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Search by skill name..."
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Skills Grid by Category -->
                <div v-if="Object.keys(filteredSkills).length > 0" class="space-y-8">
                    <div v-for="(categorySkills, category) in filteredSkills" :key="category">
                        <!-- Category Header -->
                        <div class="flex items-center mb-4">
                            <h3 class="text-xl font-semibold text-gray-900">{{ category }}</h3>
                            <span class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                                {{ categorySkills.length }}
                            </span>
                        </div>

                        <!-- Skills Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            <div
                                v-for="skill in categorySkills"
                                :key="skill.id"
                                class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                                <!-- Skill Header -->
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex items-center space-x-2">
                                        <!-- Featured Badge -->
                                        <button
                                            @click="toggleFeatured(skill)"
                                            :class="[
                                                'p-1 rounded-full',
                                                skill.is_featured 
                                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            ]"
                                            title="Toggle Featured"
                                        >
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                        </button>
                                        
                                        <!-- Active Toggle -->
                                        <button
                                            @click="toggleActive(skill)"
                                            :class="[
                                                'w-8 h-4 rounded-full relative inline-flex transition-colors',
                                                skill.is_active ? 'bg-green-400' : 'bg-gray-300'
                                            ]"
                                            title="Toggle Active"
                                        >
                                            <span
                                                :class="[
                                                    'w-3 h-3 bg-white rounded-full transition-transform absolute top-0.5',
                                                    skill.is_active ? 'translate-x-4' : 'translate-x-0.5'
                                                ]"
                                            ></span>
                                        </button>
                                    </div>
                                    
                                    <!-- Actions Dropdown -->
                                    <div class="relative group">
                                        <button class="text-gray-400 hover:text-gray-600 p-1 rounded group-hover:bg-gray-100">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"/>
                                            </svg>
                                        </button>
                                        
                                        <!-- Dropdown Menu -->
                                        <div class="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                            <Link
                                                :href="route('admin.skills.edit', skill.id)"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <button
                                                @click="deleteSkill(skill)"
                                                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Logo -->
                                <div class="flex justify-center mb-3">
                                    <img
                                        :src="getLogoUrl(skill)"
                                        :alt="skill.name"
                                        class="w-12 h-12 object-contain"
                                        @error="(e) => e.target.src = '/images/default-tech-logo.svg'"
                                    />
                                </div>

                                <!-- Skill Info -->
                                <div class="text-center">
                                    <h4 class="font-medium text-gray-900 text-sm mb-1">{{ skill.name }}</h4>
                                    <p v-if="skill.description" class="text-xs text-gray-500 line-clamp-2">
                                        {{ skill.description }}
                                    </p>
                                    
                                    <!-- Sort Order -->
                                    <div class="mt-2 text-xs text-gray-400">
                                        Order: {{ skill.sort_order }}
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex justify-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        :href="route('admin.skills.edit', skill.id)"
                                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        @click="deleteSkill(skill)"
                                        class="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-12 text-center">
                        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900">No skills found</h3>
                        <p class="mt-2 text-gray-500">
                            {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first skill.' }}
                        </p>
                        <div class="mt-6">
                            <Link
                                :href="route('admin.skills.create')"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Your First Skill
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>