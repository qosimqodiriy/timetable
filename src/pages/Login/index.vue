<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getLogin_DEFAULT, postLogin_API, type LoginModel } from '@/services/login';


const isLogin = ref(true);
const router = useRouter();
const _loading = ref(false);
const _formData = ref<LoginModel>(getLogin_DEFAULT());

_formData.value.password = 'password'
_formData.value.email = 'saydaliyevelmurod01@gmail.com'


async function submit() {
    _loading.value = true
    const [error, response] = await postLogin_API(_formData.value)
    _loading.value = false

    if(error) return;
    router.push('/home/organization')
    localStorage.setItem('token', response.token);
};
</script>


<template>
  <div class="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-50">
      
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-[#1A56FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-[26px] font-bold text-[#2D4396] mb-2 tracking-tight">Timetable.uz ga xush kelibsiz</h1>
        <p class="text-gray-400 text-sm font-medium">
          Maktab jadvalingizni boshqarish uchun tizimga kiring
        </p>
      </div>

      <div class="bg-[#F1F5F9] p-1 rounded-2xl flex mb-5 relative">
        <div 
          class="absolute top-1 bottom-1 bg-white rounded-[12px] shadow-sm transition-all duration-300 ease-in-out"
          :style="{ width: 'calc(50% - 4px)', transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }"
        ></div>
        <button 
          @click="isLogin = true"
          class="flex-1 py-2.5 text-[15px] font-bold z-10 transition-colors duration-300"
          :class="isLogin ? 'text-[#1E293B]' : 'text-gray-400'"
        >
          Kirish
        </button>
        <button 
          @click="isLogin = false"
          class="flex-1 py-2.5 text-[15px] font-bold z-10 transition-colors duration-300"
          :class="!isLogin ? 'text-[#1E293B]' : 'text-gray-400'"
        >
          Ro'yxatdan o'tish
        </button>
      </div>

      <Transition name="fade-slide" mode="out-in">
        <form @submit.prevent="submit" class="space-y-5">
          <div class="group">
            <label class="block text-[14px] font-bold text-gray-700 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              v-model="_formData.email"
              placeholder="Enter your email"
              class="w-full px-5 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div class="group">
            <label class="block text-[14px] font-bold text-gray-700 mb-2 ml-1">Password</label>
            <div class="relative">
              <input 
              v-model="_formData.password"
                placeholder="Enter your password"
                class="w-full px-5 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <button 
            type="submit" v-loading="_loading"
            class="w-full py-3 bg-[#1A56FF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_5px_15px_rgba(26,86,255,0.25)] transition-all active:scale-[0.98] mt-2"
          >
            {{ isLogin ? 'Kirish' : "Ro'yxatdan o'tish" }}
          </button>

          <div class="relative flex items-center justify-center py-1">
            <div class="border-t border-gray-100 w-full"></div>
            <span class="bg-white px-4 text-[13px] font-medium text-gray-400 absolute">Or continue with</span>
          </div>

          <button 
            type="button"
            class="w-full py-2.5 border-2 border-gray-100 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google">
            <span class="font-bold text-[#1E293B] text-[15px]">Continue with Google</span>
          </button>
        </form>
      </Transition>

    </div>
  </div>
</template>


<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>