<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Doc } from '../../convex/_generated/dataModel'
import { computed } from 'vue'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const currentStrategyDivPerHour = computed(() => {
  if (
    !props.session.totalReturns ||
    !props.session.totalCost ||
    !props.session.totalDuration ||
    !props.session.divCost
  ) {
    return 0
  }
  const strategyProfit = props.session.totalReturns - props.session.totalCost
  const profitInDivines = strategyProfit / props.session.divCost
  const oneHourInMs = 1000 * 60 * 60
  const hoursPlayed = props.session.totalDuration / oneHourInMs
  const divinesPerHour = profitInDivines / hoursPlayed
  return Math.round(divinesPerHour * 100) / 100
})

// Dummy data for the comparison chart
const dummyStrategies = computed(() => [
  { name: 'Current Strategy', divPerHour: currentStrategyDivPerHour.value },
  { name: 'Breach Farming', divPerHour: 2.8 },
  { name: 'Essence Farming', divPerHour: 3.2 },
  { name: 'Legion Farming', divPerHour: 2.1 },
  { name: 'Expedition', divPerHour: 3.8 },
])
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle class="text-foreground">Strategy Comparison</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-3">
        <div class="text-sm text-muted-foreground mb-4">Divine Orbs per Hour Comparison</div>

        <!-- Simple bar chart with dummy data -->
        <div class="space-y-3">
          <div v-for="strategy in dummyStrategies" :key="strategy.name" class="relative">
            <div class="flex justify-between items-center mb-1">
              <span
                class="text-sm text-foreground"
                :class="strategy.name === 'Current Strategy' ? 'font-semibold' : ''"
              >
                {{ strategy.name }}
              </span>
              <span class="text-sm text-muted-foreground">{{ strategy.divPerHour }}div/h</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="
                  strategy.name === 'Current Strategy' ? 'bg-primary' : 'bg-muted-foreground/30'
                "
                :style="{ width: `${Math.min((strategy.divPerHour / 4) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-border">
          <div class="text-xs text-muted-foreground">
            * Comparison data shows dummy values for demonstration purposes
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
