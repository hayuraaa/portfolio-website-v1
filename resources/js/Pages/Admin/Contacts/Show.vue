<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    contact: Object,
});

const deleteContact = () => {
    if (confirm(`Are you sure you want to delete message from "${props.contact.name}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.contacts.destroy', props.contact.id));
    }
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<template>
    <Head :title="`Message from ${contact.name}`" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Contact Message</h2>
                    <p class="text-sm text-gray-600 mt-1">
                        Message from {{ contact.name }}
                    </p>
                </div>
                <Link
                    :href="route('admin.contacts.index')"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Messages
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Contact Info Card -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center">
                                <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span class="text-xl font-medium text-gray-700">{{ contact.name.charAt(0).toUpperCase() }}</span>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">{{ contact.name }}</h3>
                                    <p class="text-sm text-gray-500">{{ contact.email }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">Received</p>
                                <p class="text-sm font-medium text-gray-900">{{ formatDate(contact.created_at) }}</p>
                            </div>
                        </div>

                        <!-- Subject -->
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Subject</h4>
                            <p class="text-gray-900">{{ contact.subject || 'No Subject' }}</p>
                        </div>

                        <!-- Message -->
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Message</h4>
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-gray-900 whitespace-pre-line">{{ contact.message }}</p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-4 pt-6 border-t border-gray-200">
                            <a
                                :href="`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}&body=Hi ${contact.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards`"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Reply via Email
                            </a>
                            <button
                                @click="deleteContact"
                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>