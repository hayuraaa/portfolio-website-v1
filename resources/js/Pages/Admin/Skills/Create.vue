<script setup>
import { ref } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    categories: Array,
});

const logoPreview = ref(null);
const logoType = ref('url'); // 'url' or 'upload'

const form = useForm({
    name: '',
    category: '',
    description: '',
    logo_url: '',
    logo_file: null,
    sort_order: 0,
    is_featured: false,
    is_active: true,
});

const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.logo_file = file;
        form.logo_url = ''; // Clear URL when uploading file
        
        const reader = new FileReader();
        reader.onload = (e) => {
            logoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleLogoUrl = () => {
    form.logo_file = null; // Clear file when using URL
    logoPreview.value = form.logo_url;
    // Clear file input
    const fileInput = document.getElementById('logo_file');
    if (fileInput) fileInput.value = '';
};

const submit = () => {
    form.post(route('admin.skills.store'), {
        forceFormData: true,
    });
};
</script>

<template>
    <Head title="Add New Skill" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add New Skill</h2>
                <Link
                    :href="route('admin.skills.index')"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Skills
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form @submit.prevent="submit" class="p-6">
                        <div class="grid grid-cols-1 gap-6">
                            <!-- Skill Name -->
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Skill Name *</label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    placeholder="e.g., Laravel, Vue.js, Python"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                <div v-if="form.errors.name" class="text-red-600 text-sm mt-1">{{ form.errors.name }}</div>
                            </div>

                            <!-- Category -->
                            <div>
                                <label for="category" class="block text-sm font-medium text-gray-700">Category *</label>
                                <select
                                    id="category"
                                    v-model="form.category"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                                <div v-if="form.errors.category" class="text-red-600 text-sm mt-1">{{ form.errors.category }}</div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    rows="3"
                                    placeholder="Brief description of your experience with this skill"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                ></textarea>
                                <div v-if="form.errors.description" class="text-red-600 text-sm mt-1">{{ form.errors.description }}</div>
                            </div>

                            <!-- Logo Section -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Logo</label>
                                
                                <!-- Logo Type Selector -->
                                <div class="flex space-x-4 mb-4">
                                    <label class="flex items-center">
                                        <input
                                            v-model="logoType"
                                            type="radio"
                                            value="url"
                                            class="form-radio"
                                        />
                                        <span class="ml-2">External URL</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input
                                            v-model="logoType"
                                            type="radio"
                                            value="upload"
                                            class="form-radio"
                                        />
                                        <span class="ml-2">Upload File</span>
                                    </label>
                                </div>

                                <!-- Logo URL Input -->
                                <div v-if="logoType === 'url'" class="mb-4">
                                    <input
                                        v-model="form.logo_url"
                                        @input="handleLogoUrl"
                                        type="url"
                                        placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <p class="text-xs text-gray-500 mt-1">
                                        Tip: Use <a href="https://devicon.dev/" target="_blank" class="text-blue-600">Devicon</a> for tech logos
                                    </p>
                                </div>

                                <!-- Logo File Upload -->
                                <div v-if="logoType === 'upload'" class="mb-4">
                                    <input
                                        id="logo_file"
                                        type="file"
                                        accept="image/*"
                                        @change="handleLogoUpload"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                <!-- Logo Preview -->
                                <div v-if="logoPreview" class="flex justify-center p-4 bg-gray-50 rounded-lg">
                                    <img
                                        :src="logoPreview"
                                        alt="Logo preview"
                                        class="w-16 h-16 object-contain"
                                        @error="(e) => e.target.src = '/images/default-tech-logo.svg'"
                                    />
                                </div>

                                <div v-if="form.errors.logo_url" class="text-red-600 text-sm mt-1">{{ form.errors.logo_url }}</div>
                                <div v-if="form.errors.logo_file" class="text-red-600 text-sm mt-1">{{ form.errors.logo_file }}</div>
                            </div>

                            <!-- Sort Order -->
                            <div>
                                <label for="sort_order" class="block text-sm font-medium text-gray-700">Sort Order</label>
                                <input
                                    id="sort_order"
                                    v-model.number="form.sort_order"
                                    type="number"
                                    min="0"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <p class="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                <div v-if="form.errors.sort_order" class="text-red-600 text-sm mt-1">{{ form.errors.sort_order }}</div>
                            </div>

                            <!-- Checkboxes -->
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input
                                        v-model="form.is_featured"
                                        type="checkbox"
                                        class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <span class="ml-2 text-sm text-gray-700">Featured Skill</span>
                                    <span class="ml-1 text-xs text-gray-500">(highlighted in portfolio)</span>
                                </label>

                                <label class="flex items-center">
                                    <input
                                        v-model="form.is_active"
                                        type="checkbox"
                                        class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <span class="ml-2 text-sm text-gray-700">Active</span>
                                    <span class="ml-1 text-xs text-gray-500">(visible in portfolio)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end mt-6 space-x-4">
                            <Link
                                :href="route('admin.skills.index')"
                                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                            >
                                <span v-if="form.processing">Creating...</span>
                                <span v-else>Create Skill</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>