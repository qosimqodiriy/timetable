<script lang="ts" setup>
import BaseHeader from "@/components/Header/index.vue";
import BaseSidebar from "@/components/Sidebar/index.vue";

</script>


<template>
    <div class="flex" style="width: 100vw; height: 100vh">
    <BaseSidebar />

    <div class="flex flex-col flex-auto overflow-hidden">
        <BaseHeader />

        <div class="flex flex-col flex-auto p-5 pr-1.5 overflow-hidden">
            <div class="content overflow-y-auto pr-3.5 flex-auto">
                <router-view />
            </div>
        </div>
    </div>
  </div>
</template>