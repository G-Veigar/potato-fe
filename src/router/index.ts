import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'mint'
    },
    {
      path: '/login',
      name: 'login',
      component: HomeView
    },
    {
      path: '/mint',
      name: 'mint',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MintView.vue')
    },
    {
      path: '/team',
      name: 'team',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TeamPlay.vue')
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('../views/MinePage.vue')
    }
  ]
})

export default router
