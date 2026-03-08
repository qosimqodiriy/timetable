<script lang="ts" setup>

const pricing = [
  {
    name: 'Bepul',
    price: '$0',
    period: '/abadiy',
    desc: 'Kichik maktablar uchun ajoyib boshlanish',
    features: ['5 gacha sinf', 'Asosiy rejalashtirish', 'Email bilan qo\'llab-quvvatlash', 'Standart shablonlar'],
    isPopular: false,
    btnText: 'Get Started'
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/oyiga',
    desc: 'O\'sayotgan maktablar uchun rivojlangan funksiyalar',
    features: ['Cheksiz sinflar', 'Rivojlangan rejalashtirish', 'Ustuvor qo\'llab-quvvatlash', 'Moslashtirilgan shablonlar', 'Konflikt aniqlash', 'Eksport qilish imkoniyatlari'],
    isPopular: true,
    btnText: 'Get Started'
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/oyiga',
    desc: 'Katta muassasalar uchun to\'liq yechim',
    features: ['Pro dagi hamma narsalar', 'Bir nechta kampusalar', 'Rivojlangan tahlillar', '24/7 telefon qo\'llab-quvvatlash', 'Moslashtirilgan integratsiyalar', 'Ajratilgan menejer'],
    isPopular: false,
    btnText: 'Get Started'
  }
];
</script>


<template>
  <section id="pricing" class="py-24 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p class="text-gray-500 text-lg">Choose the perfect plan for your school. Start free, upgrade when you need
          more.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        <div v-for="(plan, idx) in pricing" :key="idx"
          class="relative bg-white rounded-3xl p-8 border shadow-sm flex flex-col"
          :class="plan.isPopular ? 'border-blue-500 shadow-xl md:-translate-y-4' : 'border-gray-200'">

          <div v-if="plan.isPopular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Most Popular
          </div>

          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ plan.name }}</h3>
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-5xl font-extrabold text-gray-900">{{ plan.price }}</span>
              <span class="text-gray-500 font-medium">{{ plan.period }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-4">{{ plan.desc }}</p>
          </div>

          <ul class="space-y-4 mb-8 flex-1">
            <li v-for="(feat, fIdx) in plan.features" :key="fIdx" class="flex items-start gap-3">
              <i class="ri-check-line text-emerald-500 font-bold mt-0.5"></i>
              <span class="text-gray-600 text-[15px]">{{ feat }}</span>
            </li>
          </ul>

          <button
            :class="plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'"
            class="w-full py-3.5 rounded-xl font-bold transition-all active:scale-95">
            {{ plan.btnText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>