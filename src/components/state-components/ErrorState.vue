<script setup lang="ts">
import { House, RotateCw } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  errorHeading: string
  errorMessage: string
  errorLink: string
}>()
</script>
<template>
  <div class="text-center py-12 space-y-6">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-destructive">{{ props.errorHeading }}</h3>
      <p class="text-muted-foreground">{{ props.errorMessage }}</p>
    </div>
    <div class="flex items-center justify-center gap-2">
      <RouterLink :to="props.errorLink" class="text-primary flex gap-1 items-center">
        <RotateCw class="h-4 w-4 mr-2" />
        Retry
      </RouterLink>
      or
      <RouterLink to="/" class="text-secondary-foreground flex gap-1 items-center">
        <House class="h-4 w-4 mr-2" />
        Go Home
      </RouterLink>
      if the problem persists.
    </div>
  </div>
</template>
