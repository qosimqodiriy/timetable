<script lang="ts" setup>
import { _menubar } from "@/stores/base";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

function back() {
  router.go(-1);
}

const props = defineProps({
  title: {
    type: String,
    default: '',
    required: false,
  }
})
</script>

<template>
  <div class="flex items-center gap-x-2">
    <i class="ri-menu-line cursor-pointer lg:hidden" @click="_menubar = !_menubar"></i>

    <div v-if="route?.meta?.back" @click="back" class="border-main-stroke-color bg-white flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border">
      <i class="icon-arrow-left-2 text-2xl" />
    </div>

    <p class="font-medium text-xl" v-if="title">{{ props.title }}</p>
    <p class="font-medium text-xl" v-else-if="route?.meta?.title">{{ $t(route?.meta?.title as string) }}</p>
  </div>
</template>
