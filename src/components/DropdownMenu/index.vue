<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const close = () => {
    isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        close();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="relative inline-block text-left" ref="containerRef">
        <div @click="toggle" class="cursor-pointer">
            <slot name="trigger"></slot>
        </div>

        <transition enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95 translate-y-1"
            enter-to-class="transform opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100 translate-y-0"
            leave-to-class="transform opacity-0 scale-95 translate-y-1">
            <div v-if="isOpen"
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click="close">
                <div class="py-1">
                    <slot name="content"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>