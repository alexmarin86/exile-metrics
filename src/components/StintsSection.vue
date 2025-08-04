<script setup lang="ts">
import type { Doc } from '../../convex/_generated/dataModel'
import SessionNotes from './SessionNotes.vue'
import StintTimer from './StintTimer.vue'
import StintsList from './StintsList.vue'

type FarmingSession = Doc<'FarmingSession'>

defineProps<{
  session: FarmingSession
}>()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-3">
    <StintTimer :session="session" />
    <SessionNotes :session="session" />
    <StintsList :session="session" />
  </div>
</template>
