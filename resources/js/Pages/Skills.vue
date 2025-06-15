<script setup>
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue';
import BackgroundEffects from '@/Components/BackgroundEffects.vue';


const props = defineProps({
    profile: Object,
    skillsGrouped: Object,
    featuredSkills: Array,
    totalSkills: Number,
});

const isLoaded = ref(false);

// Get profile title for meta
const profileTitle = computed(() => {
    return props.profile?.title || 'Full Stack Developer & ML Engineer';
});

// Category display names mapping
const categoryDisplayNames = {
    'Frontend': 'Frontend Development',
    'Backend': 'Backend Development',
    'Database': 'Database & Storage',
    'Machine Learning': 'Machine Learning & AI',
    'DevOps': 'DevOps & Cloud',
    'Mobile': 'Mobile Development',
    'Tools': 'Tools & Platforms',
    'Other': 'Other Technologies'
};

// Get display name for category
const getCategoryDisplayName = (category) => {
    return categoryDisplayNames[category] || category;
};

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true;
        console.log('SkillsPage loaded, isLoaded:', isLoaded.value); // Debug: Pastikan komponen ter-mount
    }, 100);
});
</script>

<template>
    <Head :title="`Skills - ${profileTitle}`" />

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
        <PortfolioNavbar activeSection="skills" />

        <!-- Main Content -->
        <main class="relative z-40 min-h-screen pt-4 pb-32 px-6">
            <div class="max-w-6xl mx-auto">

                <!-- Header Section -->
                <div :class="[
                    'mt-12 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-white mb-4 tracking-tight">Technical Expertise</h2>
                        <p class="text-lg text-white/70 max-w-2xl mx-auto">
                            A comprehensive toolkit of modern technologies and frameworks I use to build exceptional digital experiences
                        </p>
                    </div>
                </div>

                <!-- Skills Categories Grid -->
                <div :class="[
                    'grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div
                        v-for="(skills, category, index) in skillsGrouped"
                        :key="category"
                        class="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                        <!-- Efek cahaya saat hover -->
                        <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div class="p-8">
                            <!-- Shimmer effect -->
                            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                            </div>
                            <h3 class="text-2xl font-semibold text-white mb-6 text-center">
                                {{ getCategoryDisplayName(category) }}
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div
                                    v-for="(skill, skillIndex) in skills"
                                    :key="skill.id"
                                    class="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:scale-[1.08] transition-all duration-300"
                                    :style="{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }"
                                >
                                    <div class="text-center">
                                        <div class="mb-2">
                                            <img
                                                :src="skill.logo_display_url"
                                                :alt="skill.name"
                                                class="w-8 h-8 object-contain mx-auto group-hover:opacity-90 transition-opacity duration-200"
                                                @error="(e) => {
                                                    console.log('Image load error for:', skill.name);
                                                    e.target.src = '/images/default-tech-logo.svg';
                                                }"
                                            />
                                        </div>
                                        <h4 class="text-white font-medium text-sm group-hover:text-white/90 transition-colors">
                                            {{ skill.name }}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Always Learning Section -->
                <div :class="[
                    'mt-12 text-center transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl max-w-2xl mx-auto">
                        <div class="p-8">
                            <h3 class="text-xl font-semibold text-white mb-4">Always Learning</h3>
                            <p class="text-white/70 leading-relaxed">
                                Technology evolves rapidly, and so do I. Currently exploring advanced AI techniques,
                                cloud architecture patterns, and emerging web technologies to stay at the forefront of innovation.
                            </p>
                        </div>
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

/* Glassmorphism enhancements */
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

/* Custom animations */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
    .md\:grid-cols-3 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 1024px) {
    .lg\:grid-cols-2 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

/* Responsive text scaling */
@media (max-width: 768px) {
    h2 {
        font-size: 3rem;
    }
}

@media (max-width: 640px) {
    h2 {
        font-size: 2.5rem;
    }
}
</style>