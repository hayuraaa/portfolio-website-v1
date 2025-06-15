<script setup>
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    blog: Object,
    relatedBlogs: Array,
});

const toggleFeatured = () => {
    useForm({
        _method: 'PATCH'
    }).post(route('admin.blogs.toggle-featured', props.blog.id));
};

const changeStatus = (status) => {
    useForm({
        _method: 'PATCH',
        status: status
    }).post(route('admin.blogs.change-status', props.blog.id));
};

const deleteBlog = () => {
    if (confirm(`Are you sure you want to delete "${props.blog.title}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.blogs.destroy', props.blog.id));
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
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getImageUrl = (blog) => {
    return blog.featured_image_url || '/images/default-blog.svg';
};
</script>

<template>
    <Head :title="blog.title" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Blog Post Preview</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ blog.category }} • {{ blog.read_time }} min read</p>
                </div>
                <div class="flex space-x-3">
                    <Link
                        :href="route('admin.blogs.edit', blog.id)"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit Post
                    </Link>
                    <Link
                        :href="route('admin.blogs.index')"
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Blogs
                    </Link>
                </div>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Post Meta Info -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <span :class="[
                                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                                    getStatusColor(blog.status)
                                ]">
                                    {{ blog.status_label }}
                                </span>
                                <span v-if="blog.is_featured" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    ⭐ Featured
                                </span>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {{ blog.category }}
                                </span>
                            </div>
                            
                            <!-- Quick Actions -->
                            <div class="flex space-x-2">
                                <button
                                    @click="toggleFeatured"
                                    class="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    {{ blog.is_featured ? 'Unfeature' : 'Feature' }}
                                </button>
                                <div class="relative group">
                                    <button class="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                                        Change Status ▼
                                    </button>
                                    <div class="absolute right-0 top-8 w-40 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                        <button
                                            @click="changeStatus('published')"
                                            v-if="blog.status !== 'published'"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            📢 Publish
                                        </button>
                                        <button
                                            @click="changeStatus('draft')"
                                            v-if="blog.status !== 'draft'"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            📝 Draft
                                        </button>
                                        <button
                                            @click="changeStatus('archived')"
                                            v-if="blog.status !== 'archived'"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            📁 Archive
                                        </button>
                                    </div>
                                </div>
                                <button
                                    @click="deleteBlog"
                                    class="text-sm px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                                <span class="font-medium">Views:</span> {{ blog.views_count || 0 }}
                            </div>
                            <div>
                                <span class="font-medium">Created:</span> {{ formatDate(blog.created_at) }}
                            </div>
                            <div>
                                <span class="font-medium">Updated:</span> {{ formatDate(blog.updated_at) }}
                            </div>
                            <div>
                                <span class="font-medium">Published:</span> {{ formatDate(blog.published_at) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <article class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <!-- Featured Image -->
                    <div v-if="blog.featured_image_url" class="w-full h-64 bg-gray-200">
                        <img
                            :src="getImageUrl(blog)"
                            :alt="blog.title"
                            class="w-full h-full object-cover"
                            @error="(e) => e.target.src = '/images/default-blog.svg'"
                        />
                    </div>
                    
                    <div class="p-8">
                        <!-- Title -->
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ blog.title }}</h1>
                        
                        <!-- Meta -->
                        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                            <span>{{ blog.read_time }} minute read</span>
                            <span v-if="blog.published_at">{{ formatDate(blog.published_at) }}</span>
                            <span>{{ blog.views_count || 0 }} views</span>
                        </div>
                        
                        <!-- Excerpt -->
                        <div class="text-lg text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                            {{ blog.excerpt }}
                        </div>
                        
                        <!-- Content -->
                        <div class="prose prose-lg max-w-none" v-html="blog.content"></div>
                        
                        <!-- Tags -->
                        <div v-if="blog.tags && blog.tags.length > 0" class="mt-8 pt-6 border-t border-gray-200">
                            <h3 class="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="tag in blog.tags"
                                    :key="tag"
                                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- SEO Info (Admin Only) -->
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <h3 class="text-sm font-medium text-gray-700 mb-3">SEO Information:</h3>
                            <div class="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                <div>
                                    <span class="font-medium text-gray-700">Meta Title:</span>
                                    <span class="text-gray-600">{{ blog.meta_title || blog.title }}</span>
                                </div>
                                <div>
                                    <span class="font-medium text-gray-700">Meta Description:</span>
                                    <span class="text-gray-600">{{ blog.meta_description || blog.excerpt }}</span>
                                </div>
                                <div v-if="blog.meta_keywords && blog.meta_keywords.length > 0">
                                    <span class="font-medium text-gray-700">Meta Keywords:</span>
                                    <span class="text-gray-600">{{ blog.meta_keywords.join(', ') }}</span>
                                </div>
                                <div>
                                    <span class="font-medium text-gray-700">URL Slug:</span>
                                    <span class="text-gray-600">/blog/{{ blog.slug }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <!-- Related Posts -->
                <div v-if="relatedBlogs && relatedBlogs.length > 0" class="mt-8">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Related Posts</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div
                                    v-for="relatedBlog in relatedBlogs"
                                    :key="relatedBlog.id"
                                    class="group cursor-pointer"
                                >
                                    <Link :href="route('admin.blogs.show', relatedBlog.id)">
                                        <div class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                :src="relatedBlog.featured_image_url || '/images/default-blog.svg'"
                                                :alt="relatedBlog.title"
                                                class="w-full h-32 object-cover"
                                                @error="(e) => e.target.src = '/images/default-blog.svg'"
                                            />
                                            <div class="p-4">
                                                <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {{ relatedBlog.title }}
                                                </h4>
                                                <p class="text-sm text-gray-500 mt-1">
                                                    {{ relatedBlog.category }} • {{ relatedBlog.read_time }} min read
                                                </p>
                                                <div class="flex items-center justify-between mt-2">
                                                    <span :class="[
                                                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                                        getStatusColor(relatedBlog.status)
                                                    ]">
                                                        {{ relatedBlog.status_label }}
                                                    </span>
                                                    <span class="text-xs text-gray-400">
                                                        {{ relatedBlog.views_count || 0 }} views
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Actions -->
                <div class="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
                        <div class="flex flex-wrap gap-3">
                            <Link
                                :href="route('admin.blogs.edit', blog.id)"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                ✏️ Edit Post
                            </Link>
                            
                            <Link
                                :href="route('admin.blogs.duplicate', blog.id)"
                                method="post"
                                as="button"
                                class="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                            >
                                📋 Duplicate Post
                            </Link>
                            
                            <button
                                @click="toggleFeatured"
                                class="bg-yellow-500 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
                            >
                                {{ blog.is_featured ? '⭐ Remove Featured' : '⭐ Make Featured' }}
                            </button>
                            
                            <button
                                v-if="blog.status === 'draft'"
                                @click="changeStatus('published')"
                                class="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                            >
                                📢 Publish Now
                            </button>
                            
                            <button
                                v-if="blog.status === 'published'"
                                @click="changeStatus('draft')"
                                class="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                            >
                                📝 Move to Draft
                            </button>
                            
                            <button
                                v-if="blog.status !== 'archived'"
                                @click="changeStatus('archived')"
                                class="bg-orange-500 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded"
                            >
                                📁 Archive Post
                            </button>
                            
                            <button
                                @click="deleteBlog"
                                class="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                            >
                                🗑️ Delete Post
                            </button>
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

.prose {
    color: #374151;
    max-width: none;
}

.prose h1 {
    color: #111827;
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
}

.prose h2 {
    color: #111827;
    font-weight: 700;
    font-size: 1.5em;
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.3333333;
}

.prose h3 {
    color: #111827;
    font-weight: 600;
    font-size: 1.25em;
    margin-top: 1.6em;
    margin-bottom: 0.6em;
    line-height: 1.6;
}

.prose p {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
}

.prose strong {
    color: #111827;
    font-weight: 600;
}

.prose a {
    color: #3b82f6;
    text-decoration: underline;
    font-weight: 500;
}

.prose a:hover {
    color: #1d4ed8;
}

.prose ul, .prose ol {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
    padding-left: 1.625em;
}

.prose li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.prose blockquote {
    font-weight: 500;
    font-style: italic;
    color: #111827;
    border-left-width: 0.25rem;
    border-left-color: #e5e7eb;
    quotes: "\201C""\201D""\2018""\2019";
    margin-top: 1.6em;
    margin-bottom: 1.6em;
    padding-left: 1em;
}

.prose code {
    color: #111827;
    font-weight: 600;
    font-size: 0.875em;
    background-color: #f3f4f6;
    padding: 0.25em 0.375em;
    border-radius: 0.25rem;
}

.prose pre {
    color: #e5e7eb;
    background-color: #1f2937;
    overflow-x: auto;
    font-size: 0.875em;
    line-height: 1.7142857;
    margin-top: 1.7142857em;
    margin-bottom: 1.7142857em;
    border-radius: 0.375rem;
    padding: 0.8571429em 1.1428571em;
}

.prose img {
    margin-top: 2em;
    margin-bottom: 2em;
    border-radius: 0.5rem;
}
</style>