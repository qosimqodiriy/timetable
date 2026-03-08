<script lang="ts" setup>

import TheHeader from './Header/index.vue'

import Hero from './Hero/index.vue'
import Features from './Features/index.vue'
import Scheduling from './Scheduling/index.vue'
import Audience from './Audience/index.vue'
import Testimonials from './Testimonials/index.vue'
import Pricing from './Pricing/index.vue'

import TheFooter from './Footer/index.vue'
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
    <the-header />

    <main class="pt-16">
      <Hero />
      <Features />
      <Scheduling />
      <Audience />
      <Testimonials />
      <Pricing />
    </main>

    <the-footer />
  </div>
</template>