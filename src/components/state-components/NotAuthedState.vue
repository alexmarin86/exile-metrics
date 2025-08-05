<script setup lang="ts">
const props = defineProps<{
  unauthedHeading: string
  unauthedMessage: string
}>()
</script>
<template>
  <div class="text-center py-12">
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-muted-foreground">{{ props.unauthedHeading }}</h2>
      <p class="text-muted-foreground">{{ props.unauthedMessage }}</p>
    </div>
  </div>
</template>
