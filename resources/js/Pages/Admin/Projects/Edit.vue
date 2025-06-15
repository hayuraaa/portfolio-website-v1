<script setup>
import { ref, onMounted } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    project: Object,
    categories: Array,
    skills: Array,
});

const imagePreview = ref(null);
const galleryPreviews = ref([]);
const selectedTechnologies = ref([]);

const form = useForm({
    _method: 'PUT', // Tambahkan ini
    title: props.project.title,
    description: props.project.description,
    features: props.project.features || '',
    category: props.project.category,
    image: null,
    gallery: [],
    technologies: props.project.technologies || [],
    demo_url: props.project.demo_url || '',
    github_url: props.project.github_url || '',
    completed_at: props.project.completed_at || '',
    sort_order: props.project.sort_order,
    is_featured: props.project.is_featured,
    is_active: props.project.is_active,
});


// Initialize data
onMounted(() => {
    if (props.project.image_url) {
        imagePreview.value = props.project.image_url;
    }
    
    if (props.project.gallery_urls && props.project.gallery_urls.length > 0) {
        galleryPreviews.value = [...props.project.gallery_urls];
    }
    
    if (props.project.technologies) {
        selectedTechnologies.value = [...props.project.technologies];
    }
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
    // Buat form data baru tanpa field yang null
    const formData = { ...form.data() };
    
    // Hapus field image jika null atau tidak ada file
    if (!form.image) {
        delete formData.image;
    }
    
    // Hapus field gallery jika null atau tidak ada file
    if (!form.gallery || form.gallery.length === 0) {
        delete formData.gallery;
    }
    
    // Submit dengan data yang sudah dibersihkan
    form.post(route('admin.projects.update', props.project.id), {
        forceFormData: true,
        onSuccess: () => {
            // Reset file inputs setelah berhasil
            form.image = null;
            form.gallery = [];
        }
    });
};

// Generate image URL
const getImageUrl = (project) => {
    if (project.image_url) {
        return project.image_url;
    }
    return '/images/default-project.svg';
};
</script>

<template>
    <Head :title="`Edit ${project.title}`" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Edit Project</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ project.title }}</p>
                </div>
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
                
                <!-- Current Project Preview -->
                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 class="text-sm font-medium text-gray-700 mb-4">Current Project</h3>
                    <div class="flex items-start space-x-6">
                        <img
                            :src="getImageUrl(project)"
                            :alt="project.title"
                            class="w-24 h-24 object-cover rounded-lg"
                            @error="(e) => e.target.src = '/images/default-project.svg'"
                        />
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900">{{ project.title }}</h4>
                            <p class="text-sm text-gray-600 mt-1">{{ project.category }}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <span v-if="project.is_featured" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    ⭐ Featured
                                </span>
                                <span :class="[
                                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                    project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ project.is_active ? '✅ Active' : '❌ Inactive' }}
                                </span>
                            </div>
                            <div class="flex space-x-2 mt-2">
                                <a
                                    v-if="project.demo_url"
                                    :href="project.demo_url"
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    🚀 Demo
                                </a>
                                <a
                                    v-if="project.github_url"
                                    :href="project.github_url"
                                    target="_blank"
                                    class="text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    📦 Code
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

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
                                        <p class="text-xs text-gray-500 mt-1">Upload a new image to replace the current one</p>
                                        
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
                                        <p class="text-xs text-gray-500 mt-1">Upload new images to replace the current gallery</p>
                                        
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
                                <span v-if="form.processing">Updating...</span>
                                <span v-else>Update Project</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>