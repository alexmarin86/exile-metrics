<script setup lang="ts">
const props = defineProps<{
  emptyHeading: string
  emptyMessage: string
}>()
</script>
<template>
  <div class="text-center py-12">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-muted-foreground">{{ props.emptyHeading }}</h3>
      <p class="text-muted-foreground">{{ props.emptyMessage }}</p>
    </div>
  </div>
</template>
