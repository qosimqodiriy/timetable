<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navLinks = [
  { name: 'Xususiyatlar', href: '#features' },
  { name: 'Maktablar uchun', href: '#audience' },
  { name: 'Fikrlar', href: '#testimonials' },
  { name: 'Narxlar', href: '#pricing' },
  { name: 'Bog\'lanish', href: '#contact' },
];

const goLogin = () => {
  router.push('/login');
};

const scrollTop = () => {
    router.replace({})
    window.scrollTo(0,0);
};
</script>


<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div class="flex items-center gap-2 cursor-pointer" @click="scrollTop">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <i class="ri-book-open-line text-lg"></i>
          </div>
          <span class="text-xl font-extrabold text-blue-700 tracking-tight">Timetable.uz</span>
        </div>

        <nav class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" class="text-[15px] font-medium text-gray-600 hover:text-blue-600 transition-colors">{{ link.name }}</a>
        </nav>

        <div @click="goLogin" class="flex items-center gap-4">
          <button class="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors hidden sm:block">Kirish</button>
          <button class="bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-600/20">Boshlash</button>
        </div>
      </div>
    </header>
</template>