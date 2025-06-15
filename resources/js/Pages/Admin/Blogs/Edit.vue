<script setup>
import { ref, computed, onMounted } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    blog: Object,
    categories: Array,
    statuses: Object,
    popularTags: Array,
});

const imagePreview = ref(null);
const tagInput = ref('');
const metaKeywordInput = ref('');

const form = useForm({
    _method: 'PUT',
    title: props.blog.title,
    excerpt: props.blog.excerpt,
    content: props.blog.content,
    featured_image: null, // Only for new uploads
    tags: props.blog.tags || [],
    category: props.blog.category,
    status: props.blog.status,
    is_featured: props.blog.is_featured,
    published_at: props.blog.published_at ? props.blog.published_at.split('T')[0] : '',
    meta_title: props.blog.meta_title || '',
    meta_description: props.blog.meta_description || '',
    meta_keywords: props.blog.meta_keywords || [],
    sort_order: props.blog.sort_order,
});

// Initialize data
onMounted(() => {
    if (props.blog.featured_image_url) {
        imagePreview.value = props.blog.featured_image_url;
    }
});

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.featured_image = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const addTag = () => {
    const tag = tagInput.value.trim();
    if (tag && !form.tags.includes(tag)) {
        form.tags.push(tag);
        tagInput.value = '';
    }
};

const removeTag = (index) => {
    form.tags.splice(index, 1);
};

const addPopularTag = (tag) => {
    if (!form.tags.includes(tag)) {
        form.tags.push(tag);
    }
};

const addMetaKeyword = () => {
    const keyword = metaKeywordInput.value.trim();
    if (keyword && !form.meta_keywords.includes(keyword)) {
        form.meta_keywords.push(keyword);
        metaKeywordInput.value = '';
    }
};

const removeMetaKeyword = (index) => {
    form.meta_keywords.splice(index, 1);
};

const generateSlugPreview = computed(() => {
    return form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
});

const characterCount = computed(() => ({
    title: form.title.length,
    excerpt: form.excerpt.length,
    metaTitle: form.meta_title.length,
    metaDescription: form.meta_description.length,
}));

const submit = () => {
    form.post(route('admin.blogs.update', props.blog.id), {
        forceFormData: true,
    });
};

const saveAsDraft = () => {
    form.status = 'draft';
    submit();
};

const publish = () => {
    form.status = 'published';
    if (!form.published_at) {
        form.published_at = new Date().toISOString().split('T')[0];
    }
    submit();
};

const getCurrentImageUrl = () => {
    if (props.blog.featured_image_url) {
        return props.blog.featured_image_url;
    }
    return '/images/default-blog.svg';
};
</script>

<template>
    <Head :title="`Edit ${blog.title}`" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Edit Blog Post</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ blog.title }}</p>
                </div>
                <div class="flex space-x-3">
                    <Link
                        :href="route('admin.blogs.show', blog.id)"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Preview
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
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Current Blog Preview -->
                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 class="text-sm font-medium text-gray-700 mb-4">Current Post</h3>
                    <div class="flex items-start space-x-6">
                        <img
                            :src="getCurrentImageUrl()"
                            :alt="blog.title"
                            class="w-24 h-24 object-cover rounded-lg"
                            @error="(e) => e.target.src = '/images/default-blog.svg'"
                        />
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">{{ blog.title }}</h4>
                            <p class="text-sm text-gray-600 mt-1">{{ blog.category }}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <span :class="[
                                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                    blog.status === 'published' ? 'bg-green-100 text-green-800' :
                                    blog.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                ]">
                                    {{ blog.status_label }}
                                </span>
                                <span v-if="blog.is_featured" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    ⭐ Featured
                                </span>
                            </div>
                            <div class="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                <span>{{ blog.views_count || 0 }} views</span>
                                <span>{{ blog.read_time }} min read</span>
                                <span v-if="blog.published_at">Published: {{ new Date(blog.published_at).toLocaleDateString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submit">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <!-- Main Content (Left) -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Basic Information -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
                                    
                                    <!-- Title -->
                                    <div class="mb-6">
                                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                                            Post Title *
                                            <span class="text-xs text-gray-500">({{ characterCount.title }}/255)</span>
                                        </label>
                                        <input
                                            id="title"
                                            v-model="form.title"
                                            type="text"
                                            placeholder="Enter an engaging title for your blog post"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            :class="{ 'border-red-500': form.errors.title }"
                                            required
                                        />
                                        <div v-if="generateSlugPreview && form.title" class="mt-1 text-xs text-gray-500">
                                            URL Preview: /blog/{{ generateSlugPreview }}
                                        </div>
                                        <div v-if="form.errors.title" class="text-red-600 text-sm mt-1">{{ form.errors.title }}</div>
                                    </div>

                                    <!-- Excerpt -->
                                    <div class="mb-6">
                                        <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                                            Excerpt *
                                            <span class="text-xs text-gray-500">({{ characterCount.excerpt }}/500)</span>
                                        </label>
                                        <textarea
                                            id="excerpt"
                                            v-model="form.excerpt"
                                            rows="3"
                                            placeholder="Write a compelling summary of your blog post (used in previews and SEO)"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            :class="{ 'border-red-500': form.errors.excerpt }"
                                            required
                                        ></textarea>
                                        <div v-if="form.errors.excerpt" class="text-red-600 text-sm mt-1">{{ form.errors.excerpt }}</div>
                                    </div>

                                    <!-- Content -->
                                    <div>
                                        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                                        <textarea
                                            id="content"
                                            v-model="form.content"
                                            rows="15"
                                            placeholder="Write your blog content here. You can use HTML tags for formatting."
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                                            :class="{ 'border-red-500': form.errors.content }"
                                            required
                                        ></textarea>
                                        <p class="text-xs text-gray-500 mt-1">
                                            You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;a&gt;, etc.
                                        </p>
                                        <div v-if="form.errors.content" class="text-red-600 text-sm mt-1">{{ form.errors.content }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- SEO Settings -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-6">SEO Settings</h3>
                                    
                                    <!-- Meta Title -->
                                    <div class="mb-4">
                                        <label for="meta_title" class="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Title
                                            <span class="text-xs text-gray-500">({{ characterCount.metaTitle }}/60 recommended)</span>
                                        </label>
                                        <input
                                            id="meta_title"
                                            v-model="form.meta_title"
                                            type="text"
                                            placeholder="SEO title (leave empty to use post title)"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            :class="{ 'border-yellow-400': characterCount.metaTitle > 60 }"
                                        />
                                        <div v-if="form.errors.meta_title" class="text-red-600 text-sm mt-1">{{ form.errors.meta_title }}</div>
                                    </div>

                                    <!-- Meta Description -->
                                    <div class="mb-4">
                                        <label for="meta_description" class="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Description
                                            <span class="text-xs text-gray-500">({{ characterCount.metaDescription }}/160 recommended)</span>
                                        </label>
                                        <textarea
                                            id="meta_description"
                                            v-model="form.meta_description"
                                            rows="3"
                                            placeholder="SEO description (leave empty to use excerpt)"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            :class="{ 'border-yellow-400': characterCount.metaDescription > 160 }"
                                        ></textarea>
                                        <div v-if="form.errors.meta_description" class="text-red-600 text-sm mt-1">{{ form.errors.meta_description }}</div>
                                    </div>

                                    <!-- Meta Keywords -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                                        <div class="flex mb-2">
                                            <input
                                                v-model="metaKeywordInput"
                                                @keyup.enter="addMetaKeyword"
                                                type="text"
                                                placeholder="Add SEO keyword"
                                                class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <button
                                                type="button"
                                                @click="addMetaKeyword"
                                                class="px-4 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div v-if="form.meta_keywords.length > 0" class="flex flex-wrap gap-2 mb-2">
                                            <span
                                                v-for="(keyword, index) in form.meta_keywords"
                                                :key="index"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                            >
                                                {{ keyword }}
                                                <button
                                                    type="button"
                                                    @click="removeMetaKeyword(index)"
                                                    class="ml-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        </div>
                                        <div v-if="form.errors.meta_keywords" class="text-red-600 text-sm mt-1">{{ form.errors.meta_keywords }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar (Right) -->
                        <div class="space-y-6">
                            
                            <!-- Publish Settings -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
                                    
                                    <!-- Status -->
                                    <div class="mb-4">
                                        <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            id="status"
                                            v-model="form.status"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option v-for="(label, value) in statuses" :key="value" :value="value">
                                                {{ label }}
                                            </option>
                                        </select>
                                        <div v-if="form.errors.status" class="text-red-600 text-sm mt-1">{{ form.errors.status }}</div>
                                    </div>

                                    <!-- Published Date -->
                                    <div class="mb-4">
                                        <label for="published_at" class="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                                        <input
                                            id="published_at"
                                            v-model="form.published_at"
                                            type="date"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <p class="text-xs text-gray-500 mt-1">Leave empty for immediate publish</p>
                                        <div v-if="form.errors.published_at" class="text-red-600 text-sm mt-1">{{ form.errors.published_at }}</div>
                                    </div>

                                    <!-- Featured -->
                                    <div class="mb-4">
                                        <label class="flex items-center">
                                            <input
                                                v-model="form.is_featured"
                                                type="checkbox"
                                                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span class="ml-2 text-sm text-gray-700">Featured Post</span>
                                        </label>
                                        <p class="text-xs text-gray-500 mt-1">Featured posts appear prominently on your blog</p>
                                    </div>

                                    <!-- Sort Order -->
                                    <div>
                                        <label for="sort_order" class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                                        <input
                                            id="sort_order"
                                            v-model.number="form.sort_order"
                                            type="number"
                                            min="0"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <p class="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                        <div v-if="form.errors.sort_order" class="text-red-600 text-sm mt-1">{{ form.errors.sort_order }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Category & Tags -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Category & Tags</h3>
                                    
                                    <!-- Category -->
                                    <div class="mb-4">
                                        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                        <select
                                            id="category"
                                            v-model="form.category"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            :class="{ 'border-red-500': form.errors.category }"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option v-for="category in categories" :key="category" :value="category">
                                                {{ category }}
                                            </option>
                                        </select>
                                        <div v-if="form.errors.category" class="text-red-600 text-sm mt-1">{{ form.errors.category }}</div>
                                    </div>

                                    <!-- Tags -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                        <div class="flex mb-2">
                                            <input
                                                v-model="tagInput"
                                                @keyup.enter="addTag"
                                                type="text"
                                                placeholder="Add tag"
                                                class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <button
                                                type="button"
                                                @click="addTag"
                                                class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        <!-- Current Tags -->
                                        <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                                            <span
                                                v-for="(tag, index) in form.tags"
                                                :key="index"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {{ tag }}
                                                <button
                                                    type="button"
                                                    @click="removeTag(index)"
                                                    class="ml-1 text-blue-400 hover:text-blue-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        </div>

                                        <!-- Popular Tags -->
                                        <div v-if="popularTags.length > 0">
                                            <p class="text-xs text-gray-500 mb-2">Popular tags:</p>
                                            <div class="flex flex-wrap gap-1">
                                                <button
                                                    v-for="tag in popularTags"
                                                    :key="tag"
                                                    type="button"
                                                    @click="addPopularTag(tag)"
                                                    :disabled="form.tags.includes(tag)"
                                                    class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {{ tag }}
                                                </button>
                                            </div>
                                        </div>
                                        <div v-if="form.errors.tags" class="text-red-600 text-sm mt-1">{{ form.errors.tags }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Featured Image -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
                                    
                                    <input
                                        id="featured_image"
                                        type="file"
                                        accept="image/*"
                                        @change="handleImageUpload"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 2MB (leave empty to keep current image)</p>
                                    
                                    <div v-if="imagePreview" class="mt-4">
                                        <img
                                            :src="imagePreview"
                                            alt="Featured image preview"
                                            class="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            v-if="form.featured_image"
                                            type="button"
                                            @click="() => { form.featured_image = null; imagePreview = getCurrentImageUrl(); document.getElementById('featured_image').value = ''; }"
                                            class="mt-2 text-red-600 text-sm hover:text-red-800"
                                        >
                                            Remove New Image
                                        </button>
                                    </div>
                                    <div v-if="form.errors.featured_image" class="text-red-600 text-sm mt-1">{{ form.errors.featured_image }}</div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div class="p-6">
                                    <div class="space-y-3">
                                        <button
                                            type="button"
                                            @click="publish"
                                            :disabled="form.processing"
                                            class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                                        >
                                            <span v-if="form.processing">Updating...</span>
                                            <span v-else-if="form.status === 'published'">📢 Update & Keep Published</span>
                                            <span v-else>📢 Update & Publish</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            @click="saveAsDraft"
                                            :disabled="form.processing"
                                            class="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                                        >
                                            <span v-if="form.processing">Saving...</span>
                                            <span v-else>📝 Save as Draft</span>
                                        </button>
                                        
                                        <Link
                                            :href="route('admin.blogs.index')"
                                            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded text-center block"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>