<script setup>
import { Head } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue'
import ProjectDetailModal from '@/Components/ProjectDetailModal.vue'
import BackgroundEffects from '@/Components/BackgroundEffects.vue';


const props = defineProps({
    projects: Object,
})

const isLoaded = ref(false)
const showModal = ref(false)
const selectedProject = ref(null)

const openModal = (project) => {
  selectedProject.value = project
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
}

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})

// Helper untuk status warna
const getStatusColor = (status) => {
    switch (status) {
        case 'Production': return 'bg-green-500/20 text-green-300 border-green-500/30'
        case 'Beta': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        case 'Research': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
}

// Fungsi aman untuk membuka link
const openLink = (url) => {
    if (typeof window !== 'undefined' && url) {
        window.open(url, '_blank')
    }
}
</script>

<template>
    <Head title="Projects" />

    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <BackgroundEffects />
        <!-- Background Effects -->
        <div class="absolute inset-0">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute top-40 right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        </div>

        <!-- Navbar -->
        <PortfolioNavbar activeSection="projects" />

        <!-- Main Content -->
        <main class="relative z-40 min-h-screen pt-4 pb-32 px-6">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div :class="[
                    'mt-12 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-white mb-4">Featured Projects</h2>
                        <p class="text-lg text-white/70 max-w-2xl mx-auto">
                            A selection of projects that showcase my expertise in full-stack development and machine learning
                        </p>
                    </div>
                </div>

                <!-- Projects Grid -->
                <div :class="[
                    'grid grid-cols-1 lg:grid-cols-2 gap-8',
                    isLoaded ? 'opacity-100' : 'opacity-0'
                ]">
                    <div
                        v-for="(project, index) in projects.data"
                        :key="project.id"
                        class="group backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 overflow-hidden rounded-2xl"
                    >
                        <div class="relative overflow-hidden">
                            <img
                                :src="project.image_url"
                                :alt="project.title"
                                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                @error="(e) => e.target.src = '/images/default-project.svg'"
                            />
                            <!-- Gradient overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <!-- Featured Badge -->
                            <div v-if="project.is_featured" class="absolute top-4 right-4 flex items-center space-x-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs px-2 py-1 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                Featured
                            </div>

                            <!-- Category Badge -->
                            <div class="absolute top-4 left-4">
                                <span class="text-xs px-2 py-1 rounded border border-white/20 bg-black/30 text-white">
                                    {{ project.category }}
                                </span>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-6">
                            <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">
                                {{ project.title }}
                            </h3>
                            <p class="text-white/70 mb-4 leading-relaxed line-clamp-3">
                                {{ project.description }}
                            </p>

                            <!-- Technologies -->
                            <div class="flex flex-wrap gap-2 mb-6">
                                <span
                                    v-for="tech in project.technologies"
                                    :key="tech"
                                    class="px-2 py-1 text-xs rounded-full border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
                                >
                                    {{ tech }}
                                </span>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex space-x-3">
                                <button
                                    v-if="project.github_url"
                                    @click="openLink(project.github_url)"
                                    class="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    Code
                                </button>
                                <button
                                    v-if="project.demo_url"
                                    @click="openLink(project.demo_url)"
                                    class="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                    Demo
                                </button>
                                <button
                                    @click="openModal(project)"
                                    class="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="projects.links && projects.links.length > 3" :class="[
                    'mt-12 flex justify-center transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 flex space-x-1">
                        <button
                            v-for="link in projects.links"
                            :key="link.label"
                            @click="router.visit(link.url)"
                            :disabled="!link.url"
                            :class="[
                                'px-3 py-2 rounded-lg text-sm transition-colors',
                                link.active 
                                    ? 'bg-purple-500 text-white' 
                                    : link.url 
                                        ? 'text-white/70 hover:text-white hover:bg-white/10' 
                                        : 'text-white/30 cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        ></button>
                    </div>
                </div>

                <!-- No Projects -->
                <div v-if="projects.data.length === 0" :class="[
                    'text-center py-12 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8">
                        <div class="text-6xl mb-4">🚀</div>
                        <h3 class="text-xl font-semibold text-white mb-2">No projects found</h3>
                        <p class="text-white/70 mb-4">Check back soon for new projects!</p>
                        <button
                            @click="router.visit('/')"
                            class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                <!-- More Projects Section -->
                <div :class="[
                    'mt-12 text-center transform transition-all duration-1000 delay-600',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl max-w-xl mx-auto rounded-2xl overflow-hidden">
                        <div class="p-8">
                            <h3 class="text-xl font-semibold text-white mb-4">More Projects</h3>
                            <p class="text-white/70 mb-6">
                                Explore my complete portfolio on GitHub to see more projects and contributions.
                            </p>
                            <a
                                href="https://github.com/username" 
                                target="_blank"
                                class="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                                View All Projects
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal Detail Proyek -->
    <ProjectDetailModal
        :is-open="showModal"
        :project="selectedProject"
        @close="closeModal"
    />
</template>

<style scoped>
.bg-grid-pattern {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Glassmorphism enhancements */
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
</style>