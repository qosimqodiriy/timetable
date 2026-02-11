<script lang="ts" setup>
import _links from './links.json';
import { useRoute } from 'vue-router';
import { _menubar, _openMenubar } from '@/stores/base';


const route = useRoute();
</script>


<template>
  <div v-if="_menubar" class="absolute left-0 top-0 z-10 h-full w-full" @click="_menubar = false"></div>
  <div class="sidebar relative" :class="[ _menubar ? 'active' : 'not_active', _openMenubar ? 'long_menubar' : 'short_menubar' ]">
    <aside class="aside webkit_scroll_none border-r border-main-stroke-color relative flex w-full h-full flex-col overflow-hidden bg-gray-100">
      <div class="h-16 flex cursor-pointer items-center p-6 border-b" @click.stop="_openMenubar = !_openMenubar">
        <p class="text-lg font-semibold whitespace-nowrap">{{ _openMenubar ? 'School Timetable' : 'S' }}</p>
      </div>
      
      <div class="flex flex-col flex-auto overflow-y-auto webkit_scroll_none">
          <router-link to="/home/organization" class="flex flex-col gap-2 cursor-pointer p-6 py-4 border-b">
            <p class="text-sm text-gray-500" :class="_openMenubar ? '' : 'invisible'">Tashkilot</p>
            <div class="flex items-center gap-2">
                <i class="ri-building-line text-specific-icon-color leading-[100%] text-xl"></i>
                <p v-if="_openMenubar" class="text-lg leading-[110%] whitespace-nowrap">Tashkilot</p>
            </div>
          </router-link>
    
          <div class="flex flex-col gap-2 flex-auto p-3 pt-4">
            <p class="text-sm text-gray-500 px-3" :class="_openMenubar ? '' : 'invisible'">Boshqaruv</p>
            
            <ul class="flex flex-col gap-1 flex-auto">
                <li v-for="link of _links" :key="link.to" class="hover:bg-slate-100" v-show="link.visible">
                  <router-link v-if="link.to" :to="link.to" :class="route?.fullPath.includes(link.to) ? 'active_link' : ''" class="router_link flex items-center gap-2 p-3" @click="_menubar = false">
                    <i :class="link.icon" class="text-specific-icon-color leading-[100%] text-xl"></i>
                    <p v-if="_openMenubar" class="line-clamp-1 overflow-hidden whitespace-nowrap">{{ $t(link.name) }}</p>
                  </router-link>
                </li>
            </ul>
          </div>
      </div>

      <div class="p-3 border-t">
        <router-link to="/settings" class="flex items-center gap-x-2 p-3 rounded-lg hover:bg-slate-100" @click="_menubar = false">
            <i class="ri-settings-4-line text-specific-icon-color leading-[100%] text-xl"></i>
            <p v-if="_openMenubar" class="line-clamp-1 overflow-hidden whitespace-nowrap">Sozlamalar</p>
        </router-link>
      </div>
    </aside>
  </div>
</template>


<style scoped>
.router_link {
  border-radius: 5px;
}

.router_link:hover {
  background-color: #fcfcfc;
}


.active_link {
  border-radius: 5px;
  background-color: #ffffff;
}

.active_link:hover {
  background-color: #ffffff;
}

.active_link i,
.active_link p {
  color: #0044ff !important;
}

.sidebar {
  width: 260px;
  height: 100%;
  z-index: 10;
  flex-shrink: 0;
  transition: 0.5s;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}


.sidebar.long_menubar {
  width: 260px !important;
}

.sidebar.short_menubar {
  width: 72px !important;
}



@media (max-width: 1280px) {
  .sidebar.short_menubar {
    width: 68px !important;
  }
}

@media (max-width: 1024px) {
  .sidebar {
    top: 0;
    position: absolute;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  }

  .sidebar.active {
    left: 0;
  }

  .sidebar.not_active {
    left: -260px;
  }
}
</style>
