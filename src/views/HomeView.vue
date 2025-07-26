<script setup lang="ts">
import TestButton from '@/components/TestButton.vue'
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <main class="container mx-auto space-y-8">
    <HeroSection />
    <div class="flex flex-col space-y-4">
      <TestButton />
      <TestButton />
      <TestButton />
      <TestButton />
      <TestButton />
    </div>
  </main>
</template>
