<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <Button @click="count++">Counter: {{ count }}</Button>
</template>
