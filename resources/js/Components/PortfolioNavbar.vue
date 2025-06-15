<script setup>
const props = defineProps({
    activeSection: {
        type: String,
        default: 'about'
    }
});

// Navigation items dengan icon dan route
const navItems = [
    {
        name: 'About',
        id: 'about',
        href: '/',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
        name: 'Skills',
        id: 'skills',
        href: '/skills',
        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    },
    {
        name: 'Projects',
        id: 'projects',
        href: '/projects',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
        name: 'Blog',
        id: 'blog',
        href: '/blog',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        name: 'Contact',
        id: 'contact',
        href: '/contact',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    }
];

// Check if nav item is active
const isActive = (itemId) => {
    return props.activeSection === itemId;
};

// Get nav item class based on active state
const getNavClass = (itemId, isMobile = false) => {
    const baseClass = isMobile 
        ? 'group flex flex-col items-center p-2 rounded-xl transition-all duration-300'
        : 'group flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300';
    
    if (isActive(itemId)) {
        return `${baseClass} bg-white/20 border border-white/30`;
    }
    
    return `${baseClass} hover:bg-white/10`;
};

// Get icon and text class based on active state
const getIconTextClass = (itemId, isMobile = false) => {
    const iconClass = isMobile ? 'w-6 h-6 transition-colors mb-1' : 'w-5 h-5 transition-colors';
    const textClass = isMobile 
        ? 'text-xs font-medium transition-colors'
        : 'font-medium transition-colors';
    
    if (isActive(itemId)) {
        return {
            icon: `${iconClass} text-white`,
            text: `${textClass} text-white`
        };
    }
    
    return {
        icon: `${iconClass} text-white/70 group-hover:text-white`,
        text: `${textClass} text-white/70 group-hover:text-white`
    };
};
</script>

<template>
    <!-- Floating Navigation -->
    <nav class="relative z-50 pt-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6">
            <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl">
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center justify-center space-x-6 lg:space-x-8">
                    <a
                        v-for="item in navItems"
                        :key="item.id"
                        :href="item.href"
                        :class="getNavClass(item.id)"
                    >
                        <svg 
                            :class="getIconTextClass(item.id).icon" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                stroke-width="2" 
                                :d="item.icon"
                            />
                        </svg>
                        <span :class="getIconTextClass(item.id).text">
                            {{ item.name }}
                        </span>
                    </a>
                </div>

                <!-- Mobile Navigation -->
                <div class="md:hidden flex items-center justify-center">
                    <div class="grid grid-cols-5 gap-1 w-full max-w-sm">
                        <a
                            v-for="item in navItems"
                            :key="`mobile-${item.id}`"
                            :href="item.href"
                            :class="getNavClass(item.id, true)"
                        >
                            <svg 
                                :class="getIconTextClass(item.id, true).icon" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    stroke-width="2" 
                                    :d="item.icon"
                                />
                            </svg>
                            <span :class="getIconTextClass(item.id, true).text">
                                {{ item.name }}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>