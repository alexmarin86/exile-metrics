import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sessions',
      name: 'my-sessions',
      component: () => import('../views/MyFarmingSessionsView.vue'),
    },
    {
      path: '/sessions/new',
      name: 'new-session',
      component: () => import('../views/NewFarmingSessionView.vue'),
    },
    {
      path: '/sessions/:id',
      name: 'session',
      component: () => import('../views/FarmingSessionView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/admin/contact-messages',
      name: 'contact-messages',
      component: () => import('../views/ContactMessagesView.vue'),
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('../views/LicenseStatementView.vue'),
    },
  ],
})

export default router
