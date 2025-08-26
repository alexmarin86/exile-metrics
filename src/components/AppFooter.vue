<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Mail, Github } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-primary-foreground border-t border-primary/20 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <nav class="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <RouterLink
          to="/license"
          class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
        >
          © {{ new Date().getFullYear() }} Exile Metrics - GPL v3.0 Licensed
        </RouterLink>

        <a
          href="https://github.com/alexmarin86/exile-metrics"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
          ><Github class="h-4 w-4" />View on GitHub</a
        >

        <RouterLink
          to="/about"
          class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
        >
          About Us
        </RouterLink>

        <RouterLink
          to="/contact"
          class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
        >
          <Mail class="h-4 w-4" />
          Contact Us
        </RouterLink>
      </nav>
    </div>
  </footer>
</template>
