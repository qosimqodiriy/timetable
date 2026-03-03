import HomeLayout from '../layouts/default.vue'
import Landing from '../pages/Landing/index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Landing,
    },

    {
      path: '/login',
      name: 'LoginLayout',
      component: () => import('@/pages/Login/index.vue'),
    },

    {
      path: '/home',
      name: 'HomeLayout',
      component: HomeLayout,

      children: [
        {
          path: "organization",
          name: "Organization",
          meta: {
            title: "Maktab",
          },
          component: () => import("@/pages/Organization/index.vue"),
        },

        {
          path: "classes",
          name: "Classes",
          meta: {
            title: "Sinflar",
          },
          component: () => import("@/pages/Classes/index.vue"),
        },

        {
          path: "teachers",
          name: "Teachers",
          meta: {
            title: "O'qituvchilar",
          },
          component: () => import("@/pages/Teachers/index.vue"),
        },

        {
          path: "subjects",
          name: "Subjects",
          meta: {
            title: "Fanlar",
          },
          component: () => import("@/pages/Subjects/index.vue"),
        },

        {
          path: "lessons",
          name: "Lessons",
          meta: {
            title: "Darslar",
          },
          component: () => import("@/pages/Lessons/index.vue"),
        },

        {
          path: "rooms",
          name: "Rooms",
          meta: {
            title: "Xonalar",
          },
          component: () => import("@/pages/Rooms/index.vue"),
        },

        {
          path: "templates",
          name: "Templates",
          meta: {
            title: "Andozalar",
          },
          component: () => import("@/pages/Templates/index.vue"),
        },

        {
          path: "timetables",
          name: "Timetables",
          meta: {
            title: "Dars jadvallari",
          },
          component: () => import("@/pages/Timetables/index.vue"),
        },



        {
          path: "profile",
          name: "Profile",
          meta: {
            title: "Profil",
          },
          component: () => import("@/pages/Profile/index.vue"),
        },

        {
          path: "settings",
          name: "Settings",
          meta: {
            title: "Sozlamalar",
          },
          component: () => import("@/pages/Settings/index.vue"),
        },
      ]
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
    },
  ],
})

export default router
