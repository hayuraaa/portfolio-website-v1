<script setup>
import { Head } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import PortfolioNavbar from '@/Components/PortfolioNavbar.vue'
import BackgroundEffects from '@/Components/BackgroundEffects.vue';


const props = defineProps({
    profile: Object,
})

const isLoaded = ref(false)
const isSubmitting = ref(false)
const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const alertMessage = ref('')

// Form data
const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

// Contact methods with real links
const contactMethods = [
    {
        platform: "GitHub",
        handle: "@hayuraaa",
        description: "Check out my latest projects and contributions",
        color: "from-gray-600 to-gray-800",
        link: "https://github.com/hayuraaa",
        primary: true,
        icon: "github"
    },
    {
        platform: "LinkedIn",
        handle: "Haris Yunanda",
        description: "Let's connect and discuss opportunities",
        color: "from-blue-600 to-blue-800",
        link: "https://www.linkedin.com/in/harisyunanda20/",
        primary: true,
        icon: "linkedin"
    },
    {
        platform: "Instagram",
        handle: "@harisrangkuti_",
        description: "Behind the scenes of my development journey",
        color: "from-pink-500 to-purple-600",
        link: "http://instagram.com/harisrangkuti_",
        primary: false,
        icon: "instagram"
    }
]

// Stats data
const stats = [
    { label: "Years Experience", value: "2+", icon: "🚀" },
    { label: "Projects Completed", value: "50+", icon: "💻" },
    { label: "Technologies Mastered", value: "20+", icon: "⚡" },
    { label: "Client Satisfaction", value: "100%", icon: "⭐" }
]

// Open social link
const openLink = (url) => {
    if (typeof window !== 'undefined' && url) {
        window.open(url, '_blank')
    }
}

// Submit form
const submitForm = async () => {
    isSubmitting.value = true
    
    // Gunakan Inertia untuk submit form
    router.post(route('contact.store'), form.value, {
        onSuccess: (page) => {
            alertMessage.value = 'Thank you for your message! I will get back to you soon. 🎉'
            showSuccessAlert.value = true
            form.value = { name: '', email: '', subject: '', message: '' }
            isSubmitting.value = false
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                showSuccessAlert.value = false
            }, 5000)
        },
        onError: (errors) => {
            console.error('Form errors:', errors)
            alertMessage.value = 'Sorry, there was an error sending your message. Please try again. 😔'
            showErrorAlert.value = true
            isSubmitting.value = false
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                showErrorAlert.value = false
            }, 5000)
        },
        onFinish: () => {
            isSubmitting.value = false
        }
    })
}

const previewCv = () => {
    if (props.profile && props.profile.cv_file) {
        // Buka CV di tab baru untuk preview
        window.open(route('contact.preview-cv'), '_blank')
    } else {
        alert('CV file is not available at the moment.')
    }
}

// Close alert manually
const closeAlert = () => {
    showSuccessAlert.value = false
    showErrorAlert.value = false
}

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<template>
    <Head title="Contact - Let's Work Together" />

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
        <PortfolioNavbar activeSection="contact" />

        <!-- Success/Error Alert -->
        <div v-if="showSuccessAlert || showErrorAlert" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
            <div :class="[
                'backdrop-blur-md border rounded-2xl shadow-2xl p-6 max-w-md mx-auto',
                showSuccessAlert ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'
            ]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                            showSuccessAlert ? 'bg-green-500/30' : 'bg-red-500/30'
                        ]">
                            <!-- Success Icon -->
                            <svg v-if="showSuccessAlert" class="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <!-- Error Icon -->
                            <svg v-else class="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 :class="[
                                'font-semibold text-sm',
                                showSuccessAlert ? 'text-green-300' : 'text-red-300'
                            ]">
                                {{ showSuccessAlert ? 'Message Sent!' : 'Error Occurred' }}
                            </h4>
                            <p :class="[
                                'text-sm mt-1',
                                showSuccessAlert ? 'text-green-200/90' : 'text-red-200/90'
                            ]">
                                {{ alertMessage }}
                            </p>
                        </div>
                    </div>
                    <button
                        @click="closeAlert"
                        class="text-white/70 hover:text-white transition-colors ml-4"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="relative z-40 min-h-screen pt-8 pb-32 px-6">
            <div class="max-w-6xl mx-auto">

                <!-- Header Section -->
                <div :class="[
                    'mt-12 transform transition-all duration-1000',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-white mb-4">Let's Work Together</h2>
                        <p class="text-lg text-white/70 max-w-2xl mx-auto">
                            I'm always interested in hearing about new opportunities and connecting with fellow developers and innovators
                        </p>
                    </div>
                </div>

                <!-- Stats Section -->
                <div :class="[
                    'grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transform transition-all duration-1000 delay-200',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div
                        v-for="(stat, index) in stats"
                        :key="stat.label"
                        class="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 rounded-2xl animate-scale-in"
                        :style="{ animationDelay: `${index * 100}ms` }"
                    >
                        <div class="p-6 text-center">
                            <div class="text-3xl mb-2">{{ stat.icon }}</div>
                            <div class="text-2xl font-bold text-white mb-1">{{ stat.value }}</div>
                            <div class="text-sm text-white/70">{{ stat.label }}</div>
                        </div>
                    </div>
                </div>

                <!-- Contact Methods -->
                <div :class="[
                    'grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 delay-400',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div
                        v-for="(method, index) in contactMethods"
                        :key="method.platform"
                        @click="openLink(method.link)"
                        class="group backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-3xl rounded-2xl cursor-pointer"
                        :style="{ animationDelay: `${index * 150}ms` }"
                    >
                        <div class="p-8 text-center">
                            <div :class="[
                                'inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r mb-6 group-hover:scale-110 transition-transform duration-300',
                                method.color
                            ]">
                                <!-- GitHub Icon -->
                                <svg v-if="method.icon === 'github'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                
                                <!-- LinkedIn Icon -->
                                <svg v-if="method.icon === 'linkedin'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                
                                <!-- Instagram Icon -->
                                <svg v-if="method.icon === 'instagram'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>
                            
                            <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                                {{ method.platform }}
                            </h3>
                            
                            <p class="text-purple-200 font-medium mb-3">{{ method.handle }}</p>
                            
                            <p class="text-white/70 text-sm leading-relaxed mb-4">
                                {{ method.description }}
                            </p>

                            <span v-if="method.primary" class="inline-block bg-green-500/20 text-green-300 border border-green-500/30 text-xs px-3 py-1 rounded-full">
                                Primary Contact
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Contact Form Section -->
                <div :class="[
                    'backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl max-w-4xl mx-auto rounded-2xl transform transition-all duration-1000 delay-600',
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                ]">
                    <div class="p-8 md:p-12">
                        <div class="text-center mb-8">
                            <div class="text-5xl mb-6">🤝</div>
                            <h3 class="text-3xl font-bold text-white mb-6">Get in Touch</h3>
                            <p class="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Whether you're looking to build a new application, implement machine learning solutions, 
                                or need consulting on your existing projects, I'm here to help bring your ideas to life.
                            </p>
                        </div>

                        <!-- Contact Form -->
                        <form @submit.prevent="submitForm" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Name Input -->
                                <div>
                                    <label for="name" class="block text-white font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        required
                                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <!-- Email Input -->
                                <div>
                                    <label for="email" class="block text-white font-medium mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        v-model="form.email"
                                        type="email"
                                        required
                                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <!-- Subject Input -->
                            <div>
                                <label for="subject" class="block text-white font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    v-model="form.subject"
                                    type="text"
                                    class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-colors"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <!-- Message Textarea -->
                            <div>
                                <label for="message" class="block text-white font-medium mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    v-model="form.message"
                                    required
                                    rows="6"
                                    class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-colors resize-none"
                                    placeholder="Tell me about your project or how I can help you..."
                                ></textarea>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                                >
                                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                                </button>
                                
                                <button
                                    type="button"
                                    @click="previewCv"
                                    :class="[
                                        'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center',
                                        props.profile && props.profile.cv_file ? 'cursor-pointer hover:border-white/50' : 'cursor-not-allowed opacity-50'
                                    ]"
                                    :disabled="!props.profile || !props.profile.cv_file"
                                >
                                <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                    Download Resume
                                </button>
                            </div>
                        </form>

                        <!-- Footer Note -->
                        <div class="mt-8 pt-8 border-t border-white/20 text-center">
                            <p class="text-white/60 text-sm">
                                Currently available for freelance projects and full-time opportunities
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
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out;
}

/* Animation for scale in */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-scale-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Custom hover effects */
.hover\:shadow-3xl:hover {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Form focus styles */
input:focus, textarea:focus {
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    h2 {
        font-size: 2.5rem;
    }
    
    h3 {
        font-size: 2rem;
    }
}

@media (max-width: 640px) {
    h2 {
        font-size: 2rem;
    }
    
    h3 {
        font-size: 1.75rem;
    }
}
</style>