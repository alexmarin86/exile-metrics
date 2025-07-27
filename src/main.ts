import { createApp } from 'vue'
import './assets/main.css'
import router from './router'
import App from './App.vue'
import { clerkPlugin } from '@clerk/vue'
import { shadcn } from '@clerk/themes'
import { createConvexVue } from '@convex-vue/core'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const app = createApp(App)

const convexVue = createConvexVue({
  convexUrl: import.meta.env.VITE_CONVEX_URL,
})
app.use(router)
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY,
  appearance: {
    baseTheme: shadcn,
  },
})
app.use(convexVue)
app.mount('#app')
