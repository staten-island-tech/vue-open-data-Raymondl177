import { createRouter, createWebHistory } from 'vue-router'
import GetCrime from '@/views/GetCrime.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Crime',
      component: GetCrime
    },
    {
      path: '/age',
      name: 'Age',
      component: () => import('@/components/AgeChart.vue')
    },
    {
      path: '/race',
      name: 'Race',
      component: () => import('@/components/RaceChart.vue')
    }
  ],
})

export default router
