<script setup>
import { ref, computed, onMounted } from 'vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    profile: Object,
    debug: Object,
});

// Debug di console browser
onMounted(() => {
    console.log('Profile data:', props.profile);
    console.log('Debug data:', props.debug);
});

const avatarPreview = ref(null);
const cvFileName = ref(null);

const form = useForm({
    name: props.profile?.name || '',
    title: props.profile?.title || '',
    bio: props.profile?.bio || '',
    description: props.profile?.description || '',
    email: props.profile?.email || '',
    phone: props.profile?.phone || '',
    location: props.profile?.location || '',
    avatar: null, // Hanya untuk file upload baru
    cv_file: null, // Hanya untuk file upload baru
    github_url: props.profile?.github_url || '',
    linkedin_url: props.profile?.linkedin_url || '',
    twitter_url: props.profile?.twitter_url || '',
    instagram_url: props.profile?.instagram_url || '',
    website_url: props.profile?.website_url || '',
});

const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.avatar = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleCvChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.cv_file = file;
        cvFileName.value = file.name;
    }
};

const removeAvatar = () => {
    form.avatar = null;
    avatarPreview.value = null;
    document.getElementById('avatar').value = '';
};

const removeCv = () => {
    form.cv_file = null;
    cvFileName.value = null;
    document.getElementById('cv_file').value = '';
};

const handleImageError = (event) => {
    console.log('Image error occurred:', event.target.src);
    event.target.src = '/images/default-avatar.svg';
};

const avatarUrl = computed(() => {
    if (avatarPreview.value) {
        return avatarPreview.value;
    }
    if (props.profile?.avatar) {
        return `/storage/${props.profile.avatar}`;
    }
    return '/images/default-avatar.svg';
});

const submit = () => {
    // Clone form data tanpa field file yang null
    const submitData = { ...form.data() };
    
    // Tambahkan _method untuk PUT
    submitData._method = 'PUT';
    
    // Hapus field file yang tidak ada isinya
    if (!form.avatar || !(form.avatar instanceof File)) {
        delete submitData.avatar;
    }
    
    if (!form.cv_file || !(form.cv_file instanceof File)) {
        delete submitData.cv_file;
    }
    
    // Submit dengan useForm baru yang sudah difilter
    useForm(submitData).post(route('admin.profile.update'), {
        forceFormData: true,
        onSuccess: () => {
            // Reset file inputs setelah berhasil
            form.avatar = null;
            form.cv_file = null;
            avatarPreview.value = null;
            cvFileName.value = null;
        }
    });
};
</script>

<template>
    <Head title="Edit Profile" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Profile
                </h2>
                <Link
                    :href="route('admin.profile.index')"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Profile
                </Link>
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

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form @submit.prevent="submit" class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-6">Edit Profile Information</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Basic Information -->
                            <div class="md:col-span-2">
                                <h4 class="text-md font-medium text-gray-800 mb-4 border-b pb-2">Basic Information</h4>
                            </div>

                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                <div v-if="form.errors.name" class="text-red-600 text-sm mt-1">{{ form.errors.name }}</div>
                            </div>
                            
                            <div>
                                <label for="title" class="block text-sm font-medium text-gray-700">Professional Title *</label>
                                <input
                                    id="title"
                                    v-model="form.title"
                                    type="text"
                                    placeholder="e.g., Full Stack Developer"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                <div v-if="form.errors.title" class="text-red-600 text-sm mt-1">{{ form.errors.title }}</div>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                <div v-if="form.errors.email" class="text-red-600 text-sm mt-1">{{ form.errors.email }}</div>
                            </div>

                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    id="phone"
                                    v-model="form.phone"
                                    type="tel"
                                    placeholder="e.g., +62 812 3456 7890"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.phone" class="text-red-600 text-sm mt-1">{{ form.errors.phone }}</div>
                            </div>

                            <div class="md:col-span-2">
                                <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    id="location"
                                    v-model="form.location"
                                    type="text"
                                    placeholder="e.g., Jakarta, Indonesia"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.location" class="text-red-600 text-sm mt-1">{{ form.errors.location }}</div>
                            </div>

                            <div class="md:col-span-2">
                                <label for="bio" class="block text-sm font-medium text-gray-700">Bio *</label>
                                <textarea
                                    id="bio"
                                    v-model="form.bio"
                                    rows="3"
                                    placeholder="A short bio about yourself (max 255 characters)"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                ></textarea>
                                <div v-if="form.errors.bio" class="text-red-600 text-sm mt-1">{{ form.errors.bio }}</div>
                            </div>

                            <div class="md:col-span-2">
                                <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    rows="5"
                                    placeholder="Detailed description about your experience, skills, and background"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                ></textarea>
                                <div v-if="form.errors.description" class="text-red-600 text-sm mt-1">{{ form.errors.description }}</div>
                            </div>

                            <!-- Files Section -->
                            <div class="md:col-span-2 border-t pt-6">
                                <h4 class="text-md font-medium text-gray-800 mb-4">Files</h4>
                            </div>

                            <!-- Avatar Upload -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                <div class="flex items-center space-x-6">
                                    <img
                                        :src="avatarUrl"
                                        alt="Avatar preview"
                                        class="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                                        @error="handleImageError"
                                    />
                                    <div class="flex-1">
                                        <input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            @change="handleAvatarChange"
                                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB (leave empty to keep current avatar)</p>
                                        <div class="mt-2 space-x-2">
                                            <button
                                                v-if="avatarPreview"
                                                type="button"
                                                @click="removeAvatar"
                                                class="text-red-600 text-sm hover:text-red-800"
                                            >
                                                Remove new avatar
                                            </button>
                                            <Link
                                                v-if="profile?.avatar && !avatarPreview"
                                                :href="route('admin.profile.remove-avatar')"
                                                method="delete"
                                                as="button"
                                                type="button"
                                                class="text-red-600 text-sm hover:text-red-800"
                                                confirm="Are you sure you want to remove the current avatar?"
                                            >
                                                Remove current avatar
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="form.errors.avatar" class="text-red-600 text-sm mt-1">{{ form.errors.avatar }}</div>
                            </div>

                            <!-- CV Upload -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
                                <div class="space-y-2">
                                    <input
                                        id="cv_file"
                                        type="file"
                                        accept=".pdf"
                                        @change="handleCvChange"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p class="text-xs text-gray-500">PDF up to 5MB (leave empty to keep current CV)</p>
                                    <div v-if="cvFileName" class="text-sm text-gray-600">
                                        New file selected: {{ cvFileName }}
                                        <button
                                            type="button"
                                            @click="removeCv"
                                            class="text-red-600 ml-2 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div v-else-if="profile?.cv_file" class="text-sm text-gray-600 space-x-2">
                                        <span>Current CV: </span>
                                        <a :href="`/storage/${profile.cv_file}`" target="_blank" class="text-blue-600 hover:text-blue-800">
                                            View current CV
                                        </a>
                                        <Link
                                            :href="route('admin.profile.remove-cv')"
                                            method="delete"
                                            as="button"
                                            type="button"
                                            class="text-red-600 hover:text-red-800"
                                            confirm="Are you sure you want to remove the current CV?"
                                        >
                                            Remove current CV
                                        </Link>
                                    </div>
                                </div>
                                <div v-if="form.errors.cv_file" class="text-red-600 text-sm mt-1">{{ form.errors.cv_file }}</div>
                            </div>

                            <!-- Social Links Section -->
                            <div class="md:col-span-2 border-t pt-6">
                                <h4 class="text-md font-medium text-gray-800 mb-4">Social Links</h4>
                            </div>

                            <div>
                                <label for="github_url" class="block text-sm font-medium text-gray-700">GitHub URL</label>
                                <input
                                    id="github_url"
                                    v-model="form.github_url"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.github_url" class="text-red-600 text-sm mt-1">{{ form.errors.github_url }}</div>
                            </div>

                            <div>
                                <label for="linkedin_url" class="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                <input
                                    id="linkedin_url"
                                    v-model="form.linkedin_url"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.linkedin_url" class="text-red-600 text-sm mt-1">{{ form.errors.linkedin_url }}</div>
                            </div>

                            <div>
                                <label for="twitter_url" class="block text-sm font-medium text-gray-700">Twitter URL</label>
                                <input
                                    id="twitter_url"
                                    v-model="form.twitter_url"
                                    type="url"
                                    placeholder="https://twitter.com/username"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.twitter_url" class="text-red-600 text-sm mt-1">{{ form.errors.twitter_url }}</div>
                            </div>

                            <div>
                                <label for="instagram_url" class="block text-sm font-medium text-gray-700">Instagram URL</label>
                                <input
                                    id="instagram_url"
                                    v-model="form.instagram_url"
                                    type="url"
                                    placeholder="https://instagram.com/username"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.instagram_url" class="text-red-600 text-sm mt-1">{{ form.errors.instagram_url }}</div>
                            </div>

                            <div>
                                <label for="website_url" class="block text-sm font-medium text-gray-700">Website URL</label>
                                <input
                                    id="website_url"
                                    v-model="form.website_url"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div v-if="form.errors.website_url" class="text-red-600 text-sm mt-1">{{ form.errors.website_url }}</div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end mt-8 pt-6 border-t space-x-4">
                            <Link
                                :href="route('admin.profile.index')"
                                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            >
                                {{ form.processing ? 'Updating...' : 'Update Profile' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>