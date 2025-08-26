<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import NotificationButton from './components/NotificationButton.vue'
import AppFooter from './components/AppFooter.vue'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
import { UserRound, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Toaster } from './components/ui/sonner'
import { ref } from 'vue'
import 'vue-sonner/style.css'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <header
      class="h-20 bg-primary-foreground supports-[backdrop-filter]:bg-primary-foreground/60 z-10 text-primary sticky top-0 backdrop-blur shadow-md shadow-primary/20"
    >
      <nav class="container mx-auto flex justify-between items-center h-full">
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-md hover:bg-primary/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>

        <div class="md:hidden">
          <RouterLink class="text-accent hover:text-accent/80" to="/"
            ><img src="./assets/logo.webp" alt="Logo" class="h-16 w-auto"
          /></RouterLink>
        </div>

        <ul class="hidden md:flex gap-4 items-center">
          <li class="mr-6">
            <RouterLink class="text-accent hover:text-accent/80" to="/"
              ><img src="./assets/logo.webp" alt="Logo" class="h-20 w-auto"
            /></RouterLink>
          </li>
          <li>
            <RouterLink
              class="text-primary text-lg underline inline-block translate-y-0 transition-all duration-300 hover:text-primary/80 hover:text-shadow-2xs hover:text-shadow-primary hover:-translate-y-px"
              to="/sessions"
              >My Sessions</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="text-primary text-lg underline inline-block translate-y-0 transition-all duration-300 hover:text-primary/80 hover:text-shadow-2xs hover:text-shadow-primary hover:-translate-y-px"
              to="/sessions/new"
              >New Session</RouterLink
            >
          </li>
        </ul>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform -translate-y-2"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-2"
        >
          <div
            v-if="isMobileMenuOpen"
            class="absolute top-20 left-0 right-0 bg-primary-foreground border-t border-primary/20 shadow-lg md:hidden z-50"
          >
            <ul class="flex flex-col p-4 space-y-4">
              <li>
                <RouterLink
                  @click="closeMobileMenu"
                  class="text-primary text-lg underline block py-2 transition-colors hover:text-primary/80"
                  to="/sessions"
                  >My Sessions</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  @click="closeMobileMenu"
                  class="text-primary text-lg underline block py-2 transition-colors hover:text-primary/80"
                  to="/sessions/new"
                  >New Session</RouterLink
                >
              </li>
            </ul>
          </div>
        </Transition>

        <div class="flex gap-6 md:gap-4 items-center pr-4 lg:pr-0">
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">
                <UserRound class="h-4 w-4" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <NotificationButton />
            <UserButton />
          </SignedIn>
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
    <div class="grow py-8 text-foreground">
      <RouterView />
    </div>
    <AppFooter />
  </div>
  <Toaster class="pointer-events-auto" theme="system" />
</template>
