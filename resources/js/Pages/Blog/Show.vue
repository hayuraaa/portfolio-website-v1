<script setup>
import { Head } from '@inertiajs/vue3'
import { ref, onMounted, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue'
import BackgroundEffects from '@/Components/BackgroundEffects.vue';


const props = defineProps({
    blog: Object,
    profile: Object,
    relatedBlogs: Array,
    nextBlog: Object,
    previousBlog: Object,
})

const isLoaded = ref(false)

// Computed untuk profile title
const profileTitle = computed(() => {
    return props.profile?.title || 'Full Stack Developer & ML Engineer'
})

// Helper untuk format tanggal
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
}

// Helper untuk format tanggal lengkap
const formatFullDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
}

// Navigation functions
const goToBlog = (slug) => {
    router.visit(route('blog.show', slug))
}

const goToCategory = (category) => {
    router.visit(route('blog.category', category))
}

const goToTag = (tag) => {
    router.visit(route('blog.tag', tag))
}

const goToBlogIndex = () => {
    router.visit(route('blog.index'))
}

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<template>
    <Head :title="`${blog.title} - Blog`" />

    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <BackgroundEffects />
        <!-- Animated Background -->
        <div class="absolute inset-0">
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

            <!-- Floating Orbs -->
            <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute top-40 right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>

            <!-- Grid Pattern -->
            <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        </div>

        <!-- Portfolio Navbar Component -->
        <PortfolioNavbar activeSection="blog" />

        <!-- Main Content -->
        <main class="relative z-40 min-h-screen pt-8 pb-32 px-6">
            <div class="max-w-6xl mx-auto">

                <!-- Back Button -->
                <div :class="[
                    'mb-6 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <button
                        @click="goToBlogIndex"
                        class="inline-flex items-center text-white/70 hover:text-white transition-colors"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Blog
                    </button>
                </div>

                <!-- Article Header -->
                <article :class="[
                    'backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    
                    <!-- Featured Image -->
                    <div class="relative h-64 md:h-80 overflow-hidden">
                        <img
                            :src="blog.featured_image_url"
                            :alt="blog.title"
                            class="w-full h-full object-cover"
                            @error="(e) => e.target.src = '/images/default-blog.svg'"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <!-- Article Meta Overlay -->
                        <div class="absolute bottom-6 left-6 right-6">
                            <div class="flex flex-wrap items-center gap-3 mb-4">
                                <!-- Featured Badge -->
                                <span v-if="blog.is_featured" class="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm px-3 py-1 rounded-full flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    Featured
                                </span>
                                
                                <!-- Category -->
                                <button
                                    @click="goToCategory(blog.category)"
                                    class="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-sm px-3 py-1 rounded-full transition-colors"
                                >
                                    {{ blog.category }}
                                </button>
                            </div>
                            
                            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {{ blog.title }}
                            </h1>
                            
                            <div class="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m3 10l1-5m-8-5h8m-4 9v-4"></path>
                                    </svg>
                                    {{ formatFullDate(blog.published_at) }}
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {{ blog.read_time }} min read
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    {{ blog.views_count }} views
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Article Content -->
                    <div class="p-8 md:p-12">
                        <!-- Excerpt -->
                        <div class="text-xl text-white/90 leading-relaxed mb-8 font-light border-l-4 border-purple-500 pl-6 italic">
                            {{ blog.excerpt }}
                        </div>

                        <!-- Content -->
                        <div class="prose prose-invert prose-lg max-w-none text-white/90 leading-relaxed" v-html="blog.content">
                        </div>

                        <!-- Tags -->
                        <div v-if="blog.tags && blog.tags.length > 0" class="mt-12 pt-8 border-t border-white/20">
                            <h3 class="text-lg font-semibold text-white mb-4">Tags</h3>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="tag in blog.tags"
                                    :key="tag"
                                    @click="goToTag(tag)"
                                    class="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 px-4 py-2 rounded-full text-sm transition-colors"
                                >
                                    #{{ tag }}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <!-- Navigation -->
                <div v-if="previousBlog || nextBlog" :class="[
                    'mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <!-- Previous Post -->
                    <div v-if="previousBlog" class="group">
                        <button
                            @click="goToBlog(previousBlog.slug)"
                            class="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 text-left"
                        >
                            <div class="flex items-center text-white/60 text-sm mb-2">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Previous Article
                            </div>
                            <h3 class="text-white group-hover:text-purple-200 transition-colors font-medium">
                                {{ previousBlog.title }}
                            </h3>
                        </button>
                    </div>

                    <!-- Next Post -->
                    <div v-if="nextBlog" class="group" :class="{ 'md:col-start-2': !previousBlog }">
                        <button
                            @click="goToBlog(nextBlog.slug)"
                            class="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 text-right"
                        >
                            <div class="flex items-center justify-end text-white/60 text-sm mb-2">
                                Next Article
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                            <h3 class="text-white group-hover:text-purple-200 transition-colors font-medium">
                                {{ nextBlog.title }}
                            </h3>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.bg-grid-pattern {
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

/* Prose styling untuk konten blog */
.prose {
    font-family: inherit;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    color: white;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.prose h1 { font-size: 2rem; }
.prose h2 { font-size: 1.75rem; }
.prose h3 { font-size: 1.5rem; }
.prose h4 { font-size: 1.25rem; }

.prose p {
    margin-bottom: 1.5rem;
    line-height: 1.75;
}

.prose ul, .prose ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
}

.prose li {
    margin-bottom: 0.5rem;
}

.prose blockquote {
    border-left: 4px solid rgba(168, 85, 247, 0.5);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
}

.prose code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
}

.prose pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 0.75rem;
    overflow-x: auto;
    margin: 2rem 0;
}

.prose pre code {
    background: none;
    padding: 0;
    color: rgba(255, 255, 255, 0.9);
}

.prose a {
    color: rgb(168, 85, 247);
    text-decoration: underline;
    transition: color 0.2s;
}

.prose a:hover {
    color: rgb(196, 181, 253);
}

.prose img {
    border-radius: 0.75rem;
    margin: 2rem 0;
    max-width: 100%;
    height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .prose h1 { font-size: 1.75rem; }
    .prose h2 { font-size: 1.5rem; }
    .prose h3 { font-size: 1.25rem; }
}
</style>