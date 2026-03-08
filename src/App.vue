<script setup lang="ts">
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'


onMounted(() => {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    offset: 100,
  })
})
</script>


<template>
  <router-view />
  <delete-modal />
</template>