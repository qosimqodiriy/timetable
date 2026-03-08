<script lang="ts" setup>
const audience = [
  {
    icon: 'ri-building-4-line',
    iconColor: 'text-blue-600',
    title: 'Maktablar',
    desc: 'Ma\'muriy vositalar bilan jadval va sinflarni boshqaring.'
  },
  {
    icon: 'ri-team-line',
    iconColor: 'text-emerald-500',
    title: 'O\'qituvchilar',
    desc: 'Ajoyib interfeyslar bilan dars va fanlarni samarali boshqaring.'
  },
  {
    icon: 'ri-user-smile-line',
    iconColor: 'text-purple-600',
    title: 'O\'quvchilar',
    desc: 'Yangi jadvalni istalgan vaqtda mobil qurilmadan ko\'ring.'
  }
];
</script>

<template>
  <section id="audience" class="py-24 bg-gray-50/50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 
          data-aos="fade-up" 
          data-aos-once="false" 
          class="text-3xl font-bold text-gray-900 mb-4"
        >
          Built for Everyone in Education
        </h2>
        
        <p 
          data-aos="fade-up" 
          data-aos-delay="100" 
          data-aos-once="false" 
          class="text-gray-500 text-lg"
        >
          Whether you're an administrator, teacher, or student, Timetable.uz has you covered.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          v-for="(item, idx) in audience" 
          :key="idx" 
          :data-aos="idx === 1 ? 'fade-up' : (idx === 0 ? 'fade-right' : 'fade-left')"
          :data-aos-delay="idx === 1 ? 100 : 300"
          data-aos-once="false"
          class="bg-white text-center p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
            <i :class="[item.icon, item.iconColor]" class="text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ item.title }}</h3>
          <p class="text-gray-500 text-[15px] leading-relaxed">{{ item.desc }}</p>
        </div>

      </div>
    </div>
  </section>
</template>