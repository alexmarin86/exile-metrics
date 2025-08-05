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
  <div class="text-center py-12">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-destructive">{{ props.errorHeading }}</h3>
      <p class="text-muted-foreground">{{ props.errorMessage }}</p>
    </div>
    <div>
      <RouterLink :to="props.errorLink" class="btn btn-primary">
        <RotateCw class="h-4 w-4 mr-2" />
        Retry
      </RouterLink>
      or
      <RouterLink to="/" class="btn btn-secondary">
        <House class="h-4 w-4 mr-2" />
        Go Home
      </RouterLink>
      if the problem persists.
    </div>
  </div>
</template>
