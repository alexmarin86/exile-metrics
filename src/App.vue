<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import NotificationButton from './components/NotificationButton.vue'
import AppFooter from './components/AppFooter.vue'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
import { UserRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Toaster } from './components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <header
      class="h-20 bg-primary-foreground supports-[backdrop-filter]:bg-primary-foreground/60 z-10 text-primary sticky top-0 backdrop-blur shadow-md shadow-primary/20"
    >
      <nav class="container mx-auto flex justify-between items-center h-full">
        <ul class="flex gap-4 items-center">
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
        <div class="flex gap-4 items-center">
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
