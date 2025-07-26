<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <header
      class="h-20 bg-primary-foreground supports-[backdrop-filter]:bg-primary-foreground/60 z-10 text-primary sticky top-0 backdrop-blur shadow-md shadow-primary/20"
    >
      <nav class="container mx-auto flex justify-between items-center h-full">
        <ul class="flex gap-4">
          <li><RouterLink class="text-accent hover:text-accent/80" to="/">Home</RouterLink></li>
          <li>
            <RouterLink class="text-accent hover:text-accent/80" to="/about">About</RouterLink>
          </li>
        </ul>
        <ThemeSwitcher />
      </nav>
    </header>
    <div class="grow py-8 text-foreground">
      <RouterView />
    </div>
  </div>
</template>
