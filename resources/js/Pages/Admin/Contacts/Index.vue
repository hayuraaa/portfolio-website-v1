<script setup>
import { ref, computed } from 'vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    contacts: Object,
    filters: Object,
    stats: Object,
});

const searchQuery = ref(props.filters.search || '');
const sortBy = ref(props.filters.sort_by || 'created_at');
const sortOrder = ref(props.filters.sort_order || 'desc');

const applyFilters = () => {
    const params = {};
    
    if (searchQuery.value) params.search = searchQuery.value;
    if (sortBy.value !== 'created_at') params.sort_by = sortBy.value;
    if (sortOrder.value !== 'desc') params.sort_order = sortOrder.value;
    
    router.get(route('admin.contacts.index'), params, {
        preserveState: true,
        preserveScroll: true,
    });
};

const clearFilters = () => {
    searchQuery.value = '';
    sortBy.value = 'created_at';
    sortOrder.value = 'desc';
    router.get(route('admin.contacts.index'));
};

const deleteContact = (contact) => {
    if (confirm(`Are you sure you want to delete message from "${contact.name}"?`)) {
        useForm({
            _method: 'DELETE'
        }).post(route('admin.contacts.destroy', contact.id));
    }
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const truncateText = (text, length = 100) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<template>
    <Head title="Contact Messages" />

    <AdminLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">Contact Messages</h2>
                    <p class="text-sm text-gray-600 mt-1">
                        {{ stats.total }} total messages, {{ stats.today }} today
                    </p>
                </div>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-blue-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
                                <div class="ml-2 text-sm text-gray-600">Total Messages</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-green-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.today }}</div>
                                <div class="ml-2 text-sm text-gray-600">Today</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-yellow-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.this_week }}</div>
                                <div class="ml-2 text-sm text-gray-600">This Week</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 border-l-4 border-purple-500">
                            <div class="flex items-center">
                                <div class="text-2xl font-bold text-gray-900">{{ stats.this_month }}</div>
                                <div class="ml-2 text-sm text-gray-600">This Month</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- Sort By -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select 
                                    v-model="sortBy"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="created_at">Date Received</option>
                                    <option value="name">Name</option>
                                    <option value="email">Email</option>
                                    <option value="subject">Subject</option>
                                </select>
                            </div>
                            
                            <!-- Sort Order -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <select 
                                    v-model="sortOrder"
                                    @change="applyFilters"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                            
                            <!-- Search -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div class="flex">
                                    <input
                                        v-model="searchQuery"
                                        @keyup.enter="applyFilters"
                                        type="text"
                                        placeholder="Search messages..."
                                        class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <button
                                        @click="applyFilters"
                                        class="px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                                    >
                                        🔍
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 flex justify-between">
                            <button
                                @click="clearFilters"
                                class="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contact Messages List -->
                <div v-if="contacts.data.length > 0">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="contact in contacts.data" :key="contact.id" class="hover:bg-gray-50">
                                        <!-- Contact Info -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center">
                                                <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span class="text-sm font-medium text-gray-700">{{ contact.name.charAt(0).toUpperCase() }}</span>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                                                    <div class="text-sm text-gray-500">{{ contact.email }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <!-- Subject -->
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900">
                                                {{ contact.subject || 'No Subject' }}
                                            </div>
                                        </td>
                                        
                                        <!-- Message -->
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900">
                                                {{ truncateText(contact.message, 80) }}
                                            </div>
                                        </td>
                                        
                                        <!-- Date -->
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatDate(contact.created_at) }}
                                        </td>
                                        
                                        <!-- Actions -->
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div class="flex items-center space-x-2">
                                                <Link
                                                    :href="route('admin.contacts.show', contact.id)"
                                                    class="text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </Link>
                                                <a
                                                    :href="`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`"
                                                    class="text-green-600 hover:text-green-800"
                                                >
                                                    Reply
                                                </a>
                                                <button
                                                    @click="deleteContact(contact)"
                                                    class="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="contacts.links && contacts.links.length > 3" class="mt-6">
                        <nav class="flex items-center justify-between">
                            <div class="flex-1 flex justify-between sm:hidden">
                                <Link
                                    v-if="contacts.prev_page_url"
                                    :href="contacts.prev_page_url"
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                                <Link
                                    v-if="contacts.next_page_url"
                                    :href="contacts.next_page_url"
                                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            </div>
                            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        Showing {{ contacts.from }} to {{ contacts.to }} of {{ contacts.total }} results
                                    </p>
                                </div>
                                <div>
                                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <Link
                                            v-for="link in contacts.links"
                                            :key="link.label"
                                            :href="link.url"
                                            v-html="link.label"
                                            :class="[
                                                'relative inline-flex items-center px-2 py-2 border text-sm font-medium',
                                                link.active
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                                                link.url === null ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                                            ]"
                                        />
                                    </nav>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-12 text-center">
                        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900">No messages found</h3>
                        <p class="mt-2 text-gray-500">
                            {{ searchQuery 
                                ? 'Try adjusting your search criteria.' 
                                : 'No contact messages have been received yet.' 
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>