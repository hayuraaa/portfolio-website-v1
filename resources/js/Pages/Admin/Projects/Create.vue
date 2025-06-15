<script setup>
import { ref } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    categories: Array,
    skills: Array,
});

const imagePreview = ref(null);
const galleryPreviews = ref([]);
const selectedTechnologies = ref([]);

const form = useForm({
    title: '',
    description: '',
    features: '',
    category: '',
    image: null,
    gallery: [],
    technologies: [],
    demo_url: '',
    github_url: '',
    completed_at: '',
    sort_order: 0,
    is_featured: false,
    is_active: true,
});

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.image = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files);
    form.gallery = files;
    
    galleryPreviews.value = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            galleryPreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
};

const toggleTechnology = (techName) => {
    const index = selectedTechnologies.value.indexOf(techName);
    if (index > -1) {
        selectedTechnologies.value.splice(index, 1);
    } else {
        selectedTechnologies.value.push(techName);
    }
    form.technologies = [...selectedTechnologies.value];
};

const submit = () => {
    form.post(route('admin.projects.store'), {
        forceFormData: true,
    });
};
</script>

<template>
    <Head title="Add New Project" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add New Project</h2>
                <Link
                    :href="route('admin.projects.index')"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Projects
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form @submit.prevent="submit" class="p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Left Column -->
                            <div class="space-y-6">
                                <!-- Basic Info -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label for="title" class="block text-sm font-medium text-gray-700">Project Title *</label>
                                            <input
                                                id="title"
                                                v-model="form.title"
                                                type="text"
                                                placeholder="e.g., E-commerce Platform, ML Classifier"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            <div v-if="form.errors.title" class="text-red-600 text-sm mt-1">{{ form.errors.title }}</div>
                                        </div>

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

                                        <div>
                                            <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
                                            <textarea
                                                id="description"
                                                v-model="form.description"
                                                rows="4"
                                                placeholder="Describe your project, its purpose, and key functionality"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            ></textarea>
                                            <div v-if="form.errors.description" class="text-red-600 text-sm mt-1">{{ form.errors.description }}</div>
                                        </div>

                                        <div>
                                            <label for="features" class="block text-sm font-medium text-gray-700">Key Features</label>
                                            <textarea
                                                id="features"
                                                v-model="form.features"
                                                rows="3"
                                                placeholder="• User authentication&#10;• Real-time notifications&#10;• Payment integration"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            ></textarea>
                                            <div v-if="form.errors.features" class="text-red-600 text-sm mt-1">{{ form.errors.features }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Links -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Links</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label for="demo_url" class="block text-sm font-medium text-gray-700">Demo URL</label>
                                            <input
                                                id="demo_url"
                                                v-model="form.demo_url"
                                                type="url"
                                                placeholder="https://your-project-demo.com"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <div v-if="form.errors.demo_url" class="text-red-600 text-sm mt-1">{{ form.errors.demo_url }}</div>
                                        </div>

                                        <div>
                                            <label for="github_url" class="block text-sm font-medium text-gray-700">GitHub URL</label>
                                            <input
                                                id="github_url"
                                                v-model="form.github_url"
                                                type="url"
                                                placeholder="https://github.com/username/repository"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <div v-if="form.errors.github_url" class="text-red-600 text-sm mt-1">{{ form.errors.github_url }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-6">
                                <!-- Images -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Images</h3>
                                    
                                    <!-- Main Image -->
                                    <div class="mb-6">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            @change="handleImageUpload"
                                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        
                                        <div v-if="imagePreview" class="mt-4">
                                            <img
                                                :src="imagePreview"
                                                alt="Preview"
                                                class="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div v-if="form.errors.image" class="text-red-600 text-sm mt-1">{{ form.errors.image }}</div>
                                    </div>

                                    <!-- Gallery Images -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                        <input
                                            id="gallery"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            @change="handleGalleryUpload"
                                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />
                                        
                                        <div v-if="galleryPreviews.length > 0" class="mt-4 grid grid-cols-2 gap-2">
                                            <img
                                                v-for="(preview, index) in galleryPreviews"
                                                :key="index"
                                                :src="preview"
                                                alt="Gallery preview"
                                                class="w-full h-24 object-cover rounded"
                                            />
                                        </div>
                                        <div v-if="form.errors.gallery" class="text-red-600 text-sm mt-1">{{ form.errors.gallery }}</div>
                                    </div>
                                </div>

                                <!-- Technologies -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Technologies Used</h3>
                                    
                                    <div class="space-y-4">
                                        <div v-for="category in skills.reduce((acc, skill) => {
                                            if (!acc.find(cat => cat.name === skill.category)) {
                                                acc.push({ name: skill.category, skills: skills.filter(s => s.category === skill.category) });
                                            }
                                            return acc;
                                        }, [])" :key="category.name">
                                            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ category.name }}</h4>
                                            <div class="flex flex-wrap gap-2">
                                                <button
                                                    v-for="skill in category.skills"
                                                    :key="skill.id"
                                                    type="button"
                                                    @click="toggleTechnology(skill.name)"
                                                    :class="[
                                                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                                                        selectedTechnologies.includes(skill.name)
                                                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    ]"
                                                >
                                                    {{ skill.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Additional Settings -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label for="completed_at" class="block text-sm font-medium text-gray-700">Completion Date</label>
                                            <input
                                                id="completed_at"
                                                v-model="form.completed_at"
                                                type="date"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <div v-if="form.errors.completed_at" class="text-red-600 text-sm mt-1">{{ form.errors.completed_at }}</div>
                                        </div>

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

                                        <div class="space-y-3">
                                            <label class="flex items-center">
                                                <input
                                                    v-model="form.is_featured"
                                                    type="checkbox"
                                                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span class="ml-2 text-sm text-gray-700">Featured Project</span>
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
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end mt-8 pt-6 border-t border-gray-200 space-x-4">
                            <Link
                                :href="route('admin.projects.index')"
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
                                <span v-else>Create Project</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>