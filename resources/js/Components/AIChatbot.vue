<template>
    <div class="fixed bottom-6 right-6 z-50">
        <!-- Chat Toggle Button -->
        <button @click="toggleChat" v-if="!isOpen"
            class="group w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center backdrop-blur-md border border-white/20">
            <svg class="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>

            <!-- Notification dot -->
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">AI</span>
            </div>
        </button>

        <!-- Chat Window -->
        <div v-if="isOpen"
            class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-80 h-96 flex flex-col transform transition-all duration-300">
            <!-- Header -->
            <div
                class="bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-md text-white p-4 rounded-t-2xl flex justify-between items-center border-b border-white/20">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-sm">AI Assistant</h3>
                        <p class="text-xs text-white/80">Tanya tentang Haris</p>
                    </div>
                </div>
                <button @click="toggleChat"
                    class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
                <div v-for="msg in messages" :key="msg.id" class="mb-4">
                    <div :class="[
                        'max-w-xs p-3 rounded-2xl',
                        msg.isUser
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                            : 'bg-white/20 backdrop-blur-md border border-white/20 text-white'
                    ]">
                        <p class="text-sm leading-relaxed">{{ msg.text }}</p>
                        <span class="text-xs opacity-70 mt-1 block">{{ msg.time }}</span>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div v-if="isTyping"
                    class="bg-white/20 backdrop-blur-md border border-white/20 text-white max-w-xs p-3 rounded-2xl">
                    <div class="flex items-center space-x-1">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                            <div class="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-75"></div>
                            <div class="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <span class="text-xs ml-2">AI sedang mengetik...</span>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 border-t border-white/20">
                <div class="flex gap-2">
                    <input v-model="currentMessage" @keypress.enter="sendMessage" :disabled="isTyping"
                        placeholder="Tanya tentang skills, project, atau background..."
                        class="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200">
                    <button @click="sendMessage" :disabled="isTyping || !currentMessage.trim()"
                        class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[40px]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>

                <!-- Quick Actions -->
                <div class="flex gap-2 mt-3">
                    <button @click="sendPredefinedMessage('Apa skill utama Haris?')" :disabled="isTyping"
                        class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-50">
                        Skills
                    </button>
                    <button @click="sendPredefinedMessage('Project apa saja yang pernah dikerjakan?')"
                        :disabled="isTyping"
                        class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-50">
                        Projects
                    </button>
                    <button @click="sendPredefinedMessage('Bagaimana cara menghubungi Haris?')" :disabled="isTyping"
                        class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-50">
                        Contact
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

// Reactive data
const isOpen = ref(false);
const messages = ref([
    {
        id: 1,
        text: "Halo! Saya AI Assistant untuk portofolio Haris. Tanya apa saja tentang background, skills, atau project yang pernah dikerjakan! 😊",
        isUser: false,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
]);
const currentMessage = ref('');
const isTyping = ref(false);
const messageId = ref(2);
const messagesContainer = ref(null);

// Methods
const toggleChat = () => {
    isOpen.value = !isOpen.value;
};

const sendPredefinedMessage = (message) => {
    if (isTyping.value) return;
    currentMessage.value = message;
    sendMessage();
};

const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return;

    // Add user message
    messages.value.push({
        id: messageId.value++,
        text: currentMessage.value,
        isUser: true,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });

    const userMessage = currentMessage.value;
    currentMessage.value = '';
    isTyping.value = true;

    // Scroll to bottom
    await nextTick();
    scrollToBottom();

    try {
        const response = await axios.post('/api/chatbot', {
            message: userMessage
        });

        // Add AI response
        messages.value.push({
            id: messageId.value++,
            text: response.data.message,
            isUser: false,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
    } catch (error) {
        messages.value.push({
            id: messageId.value++,
            text: "Maaf, terjadi kesalahan teknis. Coba lagi nanti ya! 😅",
            isUser: false,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
    }

    isTyping.value = false;

    // Scroll to bottom after response
    await nextTick();
    scrollToBottom();
};

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};
</script>

<style scoped>
.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>