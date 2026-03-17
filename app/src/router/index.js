import { createRouter, createWebHistory } from 'vue-router'
import GetCrime from '@/views/GetCrime.vue'
import CrimeData from '@/views/CrimeData.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Crime',
      component: GetCrime
    },
    {
      path: '/crime/:id',
      name: 'CrimeDetails',
      component: CrimeData
    }
  ],
})

export default router
