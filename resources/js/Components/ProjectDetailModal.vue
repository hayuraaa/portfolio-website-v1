<!-- resources/js/Components/ProjectDetailModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="relative w-full max-w-3xl max-h-[90vh] overflow-auto bg-white/10 border border-white/20 rounded-2xl shadow-2xl animate-fade-in-down">
      <!-- Close Button -->
      <button @click="close" class="absolute top-4 right-4 text-white/70 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Modal Content -->
      <div class="p-6">
        <h2 class="text-2xl font-bold text-white mb-4">{{ project.title }}</h2>

        <!-- Main Image -->
        <div v-if="project.image_url" class="mb-6 rounded-xl overflow-hidden h-60 bg-gray-800">
          <img :src="project.image_url" alt="Main Project Image" class="w-full h-full object-cover" />
        </div>

        <!-- Gallery Images -->
        <div v-if="project.gallery_urls && project.gallery_urls.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3">Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="(image, idx) in project.gallery_urls" :key="idx" class="rounded-lg overflow-hidden aspect-video">
              <img :src="image" alt="Gallery Image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-white/70 mb-6 leading-relaxed">{{ project.description }}</p>

        <!-- Features -->
        <div v-if="project.features && project.features.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-2">Features</h3>
          <p class="text-white/70 leading-relaxed">
            {{ Array.isArray(project.features) ? project.features.join(', ') : project.features }}
          </p>
        </div>

        <!-- Technologies -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-2">Technologies Used</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in project.technologies" :key="tech"
              class="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Project Links -->
        <div class="flex space-x-3 mt-6">
          <a v-if="project.github_url" :href="project.github_url" target="_blank"
            class="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded transition-colors">
            GitHub
          </a>
          <a v-if="project.demo_url" :href="project.demo_url" target="_blank"
            class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded transition-colors">
            Live Demo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  project: {
      type: Object,
      default: () => ({})
  }
})

const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}

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
</style>