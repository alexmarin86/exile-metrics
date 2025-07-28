<script setup lang="ts">
import FarmingSessionsTable from '@/components/FarmingSessionsTable.vue'
import HeroSection from '@/components/HeroSection.vue'
import { useConvexQuery } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'

const { data, isLoading } = useConvexQuery(api['farmingSessions'].get, {})
</script>

<template>
  <main class="container mx-auto space-y-8">
    <HeroSection />
    <div v-if="!isLoading" class="flex flex-col space-y-4">
      <FarmingSessionsTable :sessions="data" />
    </div>
    <span v-else>Loading...</span>
  </main>
</template>
