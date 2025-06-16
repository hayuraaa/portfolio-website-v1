<script setup>
import { Head } from '@inertiajs/vue3'
import { ref, onMounted, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue'
import BackgroundEffects from '@/Components/BackgroundEffects.vue';
import AIChatbot from '@/Components/AIChatbot.vue';


const props = defineProps({
    blogs: Object,
    profile: Object,
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
        month: 'short', 
        day: 'numeric' 
    })
}

// Helper untuk membuka link
const openBlog = (slug) => {
    router.visit(route('blog.show', slug))
}

// Helper untuk mendapatkan warna kategori
const getCategoryColor = (category) => {
    switch (category) {
        case 'Technology': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        case 'Web Development': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        case 'Mobile Development': return 'bg-green-500/20 text-green-300 border-green-500/30'
        case 'Machine Learning': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
        case 'Data Science': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        case 'DevOps': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        case 'Programming': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        case 'Tutorial': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        case 'Review': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
        case 'News': return 'bg-red-500/20 text-red-300 border-red-500/30'
        case 'Personal': return 'bg-violet-500/20 text-violet-300 border-violet-500/30'
        case 'General': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
}

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<template>
    <Head :title="`Blog & Insights - ${profileTitle}`" />

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

                <!-- Header Section -->
                <div :class="[
                    'mt-12 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-white mb-4">Blog & Insights</h2>
                        <p class="text-lg text-white/70 max-w-2xl mx-auto">
                            Sharing knowledge, experiences, and insights about technology, development practices, and industry trends
                        </p>
                    </div>
                </div>

                <!-- Blog Posts Grid -->
                <div :class="[
                    'grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <article
                        v-for="(blog, index) in blogs.data"
                        :key="blog.id"
                        @click="openBlog(blog.slug)"
                        class="group backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl overflow-hidden cursor-pointer rounded-2xl"
                        :style="{ animationDelay: `${index * 150}ms` }"
                    >
                        <!-- Featured Image -->
                        <div class="relative overflow-hidden">
                            <img
                                :src="blog.featured_image_url"
                                :alt="blog.title"
                                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                @error="(e) => e.target.src = '/images/default-blog.svg'"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <!-- Category Badge -->
                            <div class="absolute top-4 right-4">
                                <span :class="[
                                    'text-xs px-3 py-1 rounded-full border',
                                    getCategoryColor(blog.category)
                                ]">
                                    {{ blog.category }}
                                </span>
                            </div>

                            <!-- Featured Badge -->
                            <div v-if="blog.is_featured" class="absolute top-4 left-4">
                                <span class="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    Featured
                                </span>
                            </div>

                            <!-- Read Time -->
                            <div class="absolute bottom-4 left-4 text-white/80 text-sm backdrop-blur-md bg-black/30 px-2 py-1 rounded">
                                {{ blog.read_time }} min read
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-white/60 text-sm">{{ formatDate(blog.published_at) }}</span>
                                <div class="flex items-center space-x-3 text-white/60 text-sm">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                        {{ blog.views_count }}
                                    </span>
                                    <svg class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                            </div>

                            <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors line-clamp-2">
                                {{ blog.title }}
                            </h3>
                            
                            <p class="text-white/70 mb-4 leading-relaxed line-clamp-3">
                                {{ blog.excerpt }}
                            </p>

                            <!-- Tags -->
                            <div v-if="blog.tags && blog.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
                                <span
                                    v-for="tag in blog.tags.slice(0, 4)"
                                    :key="tag"
                                    class="text-xs border border-white/30 text-white/80 hover:bg-white/10 transition-colors px-2 py-1 rounded"
                                >
                                    {{ tag }}
                                </span>
                                <span v-if="blog.tags.length > 4" class="text-xs text-white/50 px-2 py-1">
                                    +{{ blog.tags.length - 4 }} more
                                </span>
                            </div>

                            <!-- Actions -->
                            <div class="flex justify-between items-center">
                                <button
                                    @click.stop="openBlog(blog.slug)"
                                    class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Read More
                                </button>
                                <div class="flex space-x-2">
                                    <button
                                        @click.stop
                                        class="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded transition-colors"
                                        title="Like"
                                    >
                                        💝
                                    </button>
                                    <button
                                        @click.stop
                                        class="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded transition-colors"
                                        title="Share"
                                    >
                                        📤
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- Pagination -->
                <div v-if="blogs.links && blogs.links.length > 3" :class="[
                    'mt-12 flex justify-center transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 flex space-x-1">
                        <button
                            v-for="link in blogs.links"
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

                <!-- No Results -->
                <div v-if="blogs.data.length === 0" :class="[
                    'text-center py-12 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8">
                        <div class="text-6xl mb-4">📝</div>
                        <h3 class="text-xl font-semibold text-white mb-2">No articles found</h3>
                        <p class="text-white/70 mb-4">Check back soon for new content!</p>
                        <button
                            @click="router.visit('/')"
                            class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <AIChatbot />
    </div>
</template>