<script setup lang="ts">
import { logout_HANDLER } from '@/services/network';
import { ref } from 'vue'
import { useRouter } from 'vue-router';


const locale = ref('en')
const router = useRouter();

const languages = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const setLocale = (code: string) => {
  locale.value = code
}

const handleCommand = async () => {
  await logout_HANDLER(true)
  router.push('/login');
}
</script>

<template>
  <div class="h-16 flex items-center justify-between p-4 border-b bg-gray-100">
    <back-title />

    <div class="flex items-center gap-4">
      <el-dropdown trigger="click" placement="bottom-end" popper-class="my-custom-dropdown">
        <i class="ri-translate-2 text-xl cursor-pointer"></i>

        <template #dropdown>
          <el-dropdown-menu class="min-w-[160px] p-0!">
            <el-dropdown-item v-for="lang in languages" :key="lang.code" @click="setLocale(lang.code)"
              class="!flex !items-center !justify-between !px-3 !py-2"
              :class="{ '!bg-blue-50 !text-blue-600': locale === lang.code }">
              <span class="flex items-center gap-2">
                <span>{{ lang.flag }}</span>
                <span class="font-medium">{{ lang.name }}</span>
              </span>
              <i v-if="locale === lang.code" class="ri-check-line text-blue-600 font-bold"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" popper-class="my-custom-dropdown" placement="bottom-end" @command="handleCommand">
        <div class="flex items-center gap-2 cursor-pointer transition-colors outline-none">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-600 shrink-0">
            SA</div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">saydaliyevelmurod01</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="min-w-[260px] p-0">
            <div class="px-4 py-3">
              <p class="text-sm font-semibold text-gray-900">My Account</p>
              <p class="text-xs text-gray-500 mt-0.5">admin@system.com</p>
            </div>

            <div class="h-px bg-gray-100 my-1"></div>

            <el-dropdown-item class="!px-4 !py-2 !flex !items-center !gap-2">
              <i class="ri-user-line text-gray-500 text-lg leading-4"></i>
              <span>Profile</span>
            </el-dropdown-item>

            <el-dropdown-item class="!px-4 !py-2 !flex !items-center !gap-2">
              <i class="ri-settings-3-line text-gray-500 text-lg"></i>
              <span>Settings</span>
            </el-dropdown-item>

            <div class="h-px bg-gray-100 my-1"></div>

            <el-dropdown-item command="logout" @click="handleCommand"
              class="!px-4 !py-2 !flex !items-center !gap-2 !text-red-600 hover:!bg-red-50">
              <i class="ri-logout-box-r-line text-lg"></i>
              <span>Log out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>