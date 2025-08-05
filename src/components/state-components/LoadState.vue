<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
const props = defineProps<{
  loadingMessage: string
}>()
</script>
<template>
  <div class="flex items-center justify-center py-12">
    <div class="flex items-center space-x-2">
      <Loader2 class="h-6 w-6 animate-spin" />
      <span class="text-muted-foreground">{{ props.loadingMessage }}</span>
    </div>
  </div>
</template>
