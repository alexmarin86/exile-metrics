<script setup lang="ts">
import SessionDetails from './SessionDetails.vue'
import StrategyComparisonChart from './StrategyComparisonChart.vue'
import type { Doc } from '../../../convex/_generated/dataModel'

type FarmingSession = Doc<'FarmingSession'>

defineProps<{
  session: FarmingSession
}>()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-3">
    <SessionDetails :session="session" />
    <StrategyComparisonChart class="col-span-2" :session="session" />
  </div>
</template>
