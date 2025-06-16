<script setup>
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue';
import BackgroundEffects from '@/Components/BackgroundEffects.vue';
import AIChatbot from '@/Components/AIChatbot.vue';

const props = defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
    laravelVersion: String,
    phpVersion: String,
    profile: Object,
});

const isLoaded = ref(false);

// Typing effect variables
const displayedText = ref('');
const currentIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = ref(100);

// Computed untuk fallback data jika profile tidak ada
const profileData = computed(() => {
    if (!props.profile) {
        return {
            name: 'Your Name',
            title: 'Full Stack Developer & ML Engineer',
            bio: 'Passionate about creating innovative solutions that bridge the gap between cutting-edge technology and real-world applications.',
            description: 'Specialized in building scalable web applications and intelligent machine learning systems that make a difference.',
            avatar_url: '/images/default-avatar.svg',
            github_url: '#',
            linkedin_url: '#',
            instagram_url: '#',
            cv_url: '#'
        };
    }
    
    return {
        name: props.profile.name,
        title: props.profile.title,
        bio: props.profile.bio,
        description: props.profile.description,
        avatar_url: props.profile.avatar_url || '/images/default-avatar.svg',
        github_url: props.profile.github_url || '#',
        linkedin_url: props.profile.linkedin_url || '#',
        instagram_url: props.profile.instagram_url || '#',
        website_url: props.profile.website_url || '#',
        twitter_url: props.profile.twitter_url || '#',
        cv_url: props.profile.cv_file ? `/storage/${props.profile.cv_file}` : '#'
    };
});

// Typing effect function
const typeWriter = () => {
    const fullText = profileData.value.title;
    
    if (!isDeleting.value && currentIndex.value <= fullText.length) {
        // Typing
        displayedText.value = fullText.substring(0, currentIndex.value);
        currentIndex.value++;
        typingSpeed.value = 100;
    } else if (isDeleting.value && currentIndex.value >= 0) {
        // Deleting
        displayedText.value = fullText.substring(0, currentIndex.value);
        currentIndex.value--;
        typingSpeed.value = 50;
    }
    
    // Switch between typing and deleting
    if (!isDeleting.value && currentIndex.value > fullText.length) {
        // Pause before deleting
        setTimeout(() => {
            isDeleting.value = true;
        }, 2000);
    } else if (isDeleting.value && currentIndex.value < 0) {
        // Pause before typing again
        setTimeout(() => {
            isDeleting.value = false;
            currentIndex.value = 0;
        }, 500);
    }
    
    setTimeout(typeWriter, typingSpeed.value);
};

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true;
        // Start typing effect after component is loaded
        setTimeout(() => {
            typeWriter();
        }, 1000);
    }, 100);
});
</script>

<template>
    <Head :title="`${profileData.name} - ${profileData.title}`" />

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
        <PortfolioNavbar activeSection="about" />

        <!-- Main Content -->
        <main class="relative z-40 flex items-center justify-center min-h-screen pt-16 pb-32 px-6">
            <div class="max-w-4xl mx-auto text-center">
                
                <!-- Profile Avatar -->
                <div :class="[
                    'mb-8 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="relative inline-block">
                        <!-- Avatar with frosted glass border -->
                        <div class="relative">
                            <div class="w-56 h-56 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm shadow-2xl">
                                <img
                                    :src="profileData.avatar_url"
                                    :alt="profileData.name"
                                    class="w-full h-full object-cover"
                                    @error="(e) => e.target.src = '/images/default-avatar.svg'"
                                />
                            </div>
                            
                            <!-- Available for hire badge -->
                            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                <div class="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-full px-4 py-1">
                                    <span class="text-green-300 text-sm font-medium flex items-center">
                                        <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                        Available for hire
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Initials Circle (decorative) -->
                        <div class="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-xl">
                            <span class="text-white font-bold text-xl">Hello !</span>
                        </div>
                    </div>
                </div>

                <!-- Name and Title -->
                <div :class="[
                    'mb-8 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <h1 class="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                        Haris Yunanda
                    </h1>
                    <!-- Updated title with typing effect -->
                    <div class="text-xl md:text-2xl font-light tracking-wide min-h-[2.5rem] flex items-center justify-center">
                        <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                            {{ displayedText }}
                        </span>
                        <span class="ml-1 w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 animate-pulse"></span>
                    </div>
                </div>

                <!-- Description -->
                <div :class="[
                    'mb-12 max-w-4xl mx-auto transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <p class="text-white/90 text-lg leading-relaxed">
                            {{ profileData.description || profileData.bio }}
                        </p>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div :class="[
                    'mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-600',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <a
                        href="/projects"
                        class="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                        <svg class="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <span>View Projects</span>
                    </a>
                    
                    <a
                        :href="profileData.cv_url"
                        target="_blank"
                        :class="[
                            'group relative inline-flex items-center space-x-3 backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300',
                            profileData.cv_url === '#' ? 'opacity-50 cursor-not-allowed' : ''
                        ]"
                    >
                        <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Download CV</span>
                    </a>
                </div>

                <!-- Social Links -->
                <div :class="[
                    'flex justify-center space-x-6 transform transition-all duration-1000 delay-800',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <a
                        v-if="profileData.github_url && profileData.github_url !== '#'"
                        :href="profileData.github_url"
                        target="_blank"
                        class="group w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    
                    <a
                        v-if="profileData.linkedin_url && profileData.linkedin_url !== '#'"
                        :href="profileData.linkedin_url"
                        target="_blank"
                        class="group w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    
                    <a
                        v-if="profileData.instagram_url && profileData.instagram_url !== '#'"
                        :href="profileData.instagram_url"
                        target="_blank"
                        class="group w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    
                    <a
                        v-if="profileData.twitter_url && profileData.twitter_url !== '#'"
                        :href="profileData.twitter_url"
                        target="_blank"
                        class="group w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    
                    <a
                        v-if="profileData.website_url && profileData.website_url !== '#'"
                        :href="profileData.website_url"
                        target="_blank"
                        class="group w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                        </svg>
                    </a>
                </div>
            </div>
        </main>
        <AIChatbot />
    </div>
</template>

<style scoped>

.bg-grid-pattern {
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
}

.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Custom animations */
@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

/* Glassmorphism enhancements */
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

/* Responsive text scaling */
@media (max-width: 768px) {
    h1 {
        font-size: 3rem;
    }
}

@media (max-width: 640px) {
    h1 {
        font-size: 2.5rem;
    }
}
</style>