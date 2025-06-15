<script setup>
import { ref, computed } from 'vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    blogs: Object,
    categories: Array,
    statuses: Object,
    filters: Object,
    stats: Object,
});

const selectedStatus = ref(props.filters.status || 'all');
const selectedCategory = ref(props.filters.category || 'all');
const searchQuery = ref(props.filters.search || '');
const sortBy = ref(props.filters.sort_by || 'created_at');
const sortOrder = ref(props.filters.sort_order || 'desc');

const applyFilters = () => {
    const params = {};
    
    if (selectedStatus.value !== 'all') params.status = selectedStatus.value;
    if (selectedCategory.value !== 'all') params.category = selectedCategory.value;
    if (searchQuery.value) params.search = searchQuery.value;
    if (sortBy.value !== 'created_at') params.sort_by = sortBy.value;
    if (sortOrder.value !== 'desc') params.sort_order = sortOrder.value;
    
    router.get(route('admin.blogs.index'), params, {
        preserveState: true,
        preserveScroll: true,
    });
};

const clearFilters = () => {
    selectedStatus.value = 'all';
    selectedCategory.value = 'all';
    searchQuery.value = '';
    sortBy.value = 'created_at';
    sortOrder.value = 'desc';
    router.get(route('admin.blogs.index'));
};

const toggleFeatured = (blog) => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.blogs.toggle-featured', blog.id));
};

const changeStatus = (blog, status) => {
    useForm({
        _method: 'PATCH',
        status: status
    }).post(route('admin.blogs.change-status', blog.id));
};

const duplicateBlog = (blog) => {
    useForm().post(route('admin.blogs.duplicate', blog.id));
};

const deleteBlog = (blog) => {
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.blogs.destroy', blog.id));
    }
};

const getStatusColor = (status) => {
    const colors = {
        'draft': 'bg-gray-100 text-gray-800',
        'published': 'bg-green-100 text-green-800',
        'archived': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (date) => {
    if (!date) return 'Not published';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const truncateText = (text, length = 100) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<template>
    <Head title="Blog Management" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Blog Management</h2>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ stats.total }} total posts, {{ stats.published }} published, {{ stats.draft }} drafts
                    </p>
                </div>
                <Link
                    :href="route('admin.blogs.create')"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Post
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-blue-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
                                <div class="ml-2 text-sm text-gray-600">Total Posts</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-green-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.published }}</div>
                                <div class="ml-2 text-sm text-gray-600">Published</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-yellow-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.draft }}</div>
                                <div class="ml-2 text-sm text-gray-600">Drafts</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-purple-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.featured }}</div>
                                <div class="ml-2 text-sm text-gray-600">Featured</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <!-- Status Filter -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select 
                                    v-model="selectedStatus"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option v-for="(label, key) in statuses" :key="key" :value="key">
                                        {{ label }}
                                    </option>
                                </select>
                            </div>
                            
                            <!-- Category Filter -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select 
                                    v-model="selectedCategory"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="all">All Categories</option>
                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                            </div>
                            
                            <!-- Sort By -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select 
                                    v-model="sortBy"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="created_at">Created Date</option>
                                    <option value="published_at">Published Date</option>
                                    <option value="title">Title</option>
                                    <option value="views_count">Views</option>
                                </select>
                            </div>
                            
                            <!-- Sort Order -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <select 
                                    v-model="sortOrder"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                            
                            <!-- Search -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div class="flex">
                                    <input
                                        v-model="searchQuery"
                                        @keyup.enter="applyFilters"
                                        type="text"
                                        placeholder="Search posts..."
                                        class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <button
                                        @click="applyFilters"
                                        class="px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                                    >
                                        🔍
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 flex justify-between">
                            <button
                                @click="clearFilters"
                                class="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Blog Posts List -->
                <div v-if="blogs.data.length > 0">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="blog in blogs.data" :key="blog.id" class="hover:bg-gray-50">
                                        <!-- Post Info -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-start space-x-4">
                                                <img
                                                    :src="blog.featured_image_url"
                                                    :alt="blog.title"
                                                    class="w-16 h-16 object-cover rounded-lg"
                                                    @error="(e) => e.target.src = '/images/default-blog.svg'"
                                                />
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-center space-x-2">
                                                        <h3 class="text-sm font-medium text-gray-900 truncate">
                                                            {{ blog.title }}
                                                        </h3>
                                                        <span v-if="blog.is_featured" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            ⭐ Featured
                                                        </span>
                                                    </div>
                                                    <p class="text-sm text-gray-500 mt-1">
                                                        {{ truncateText(blog.excerpt, 80) }}
                                                    </p>
                                                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                                        <span>{{ blog.read_time }} min read</span>
                                                        <span v-if="blog.tags && blog.tags.length">
                                                            {{ blog.tags.slice(0, 2).join(', ') }}
                                                            <span v-if="blog.tags.length > 2">+{{ blog.tags.length - 2 }}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <!-- Category -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {{ blog.category }}
                                            </span>
                                        </td>
                                        
                                        <!-- Status -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span :class="[
                                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                getStatusColor(blog.status)
                                            ]">
                                                {{ blog.status_label }}
                                            </span>
                                        </td>
                                        
                                        <!-- Published Date -->
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatDate(blog.published_at) }}
                                        </td>
                                        
                                        <!-- Views -->
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ blog.views_count || 0 }}
                                        </td>
                                        
                                        <!-- Actions -->
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div class="flex items-center space-x-2">
                                                <Link
                                                    :href="route('admin.blogs.show', blog.id)"
                                                    class="text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    :href="route('admin.blogs.edit', blog.id)"
                                                    class="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Edit
                                                </Link>
                                                
                                                <!-- Actions Dropdown -->
                                                <div class="relative group">
                                                    <button class="text-gray-400 hover:text-gray-600 p-1">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"/>
                                                        </svg>
                                                    </button>
                                                    
                                                    <div class="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                        <button
                                                            @click="toggleFeatured(blog)"
                                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {{ blog.is_featured ? '⭐ Unfeature' : '⭐ Feature' }}
                                                        </button>
                                                        
                                                        <div class="border-t border-gray-100">
                                                            <button
                                                                @click="changeStatus(blog, 'published')"
                                                                v-if="blog.status !== 'published'"
                                                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                📢 Publish
                                                            </button>
                                                            <button
                                                                @click="changeStatus(blog, 'draft')"
                                                                v-if="blog.status !== 'draft'"
                                                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                📝 Move to Draft
                                                            </button>
                                                            <button
                                                                @click="changeStatus(blog, 'archived')"
                                                                v-if="blog.status !== 'archived'"
                                                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                📁 Archive
                                                            </button>
                                                        </div>
                                                        
                                                        <div class="border-t border-gray-100">
                                                            <button
                                                                @click="duplicateBlog(blog)"
                                                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                📋 Duplicate
                                                            </button>
                                                        </div>
                                                        
                                                        <div class="border-t border-gray-100">
                                                            <button
                                                                @click="deleteBlog(blog)"
                                                                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="blogs.links && blogs.links.length > 3" class="mt-6">
                        <nav class="flex items-center justify-between">
                            <div class="flex-1 flex justify-between sm:hidden">
                                <Link
                                    v-if="blogs.prev_page_url"
                                    :href="blogs.prev_page_url"
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                                <Link
                                    v-if="blogs.next_page_url"
                                    :href="blogs.next_page_url"
                                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            </div>
                            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        Showing {{ blogs.from }} to {{ blogs.to }} of {{ blogs.total }} results
                                    </p>
                                </div>
                                <div>
                                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <Link
                                            v-for="link in blogs.links"
                                            :key="link.label"
                                            :href="link.url"
                                            v-html="link.label"
                                            :class="[
                                                'relative inline-flex items-center px-2 py-2 border text-sm font-medium',
                                                link.active
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                                                link.url === null ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                                            ]"
                                        />
                                    </nav>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-12 text-center">
                        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900">No blog posts found</h3>
                        <p class="mt-2 text-gray-500">
                            {{ searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' 
                                ? 'Try adjusting your search criteria or filters.' 
                                : 'Get started by creating your first blog post.' 
                            }}
                        </p>
                        <div class="mt-6">
                            <Link
                                :href="route('admin.blogs.create')"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Create Your First Post
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>