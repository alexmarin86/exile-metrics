<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Doc } from '../../convex/_generated/dataModel'
import { computed } from 'vue'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const strategyProfit = computed(() => {
  if (!props.session.totalReturns || !props.session.totalCost) {
    return 0
  }
  return props.session.totalReturns - props.session.totalCost
})

const profitInDivines = computed(() => {
  if (!props.session.divCost || strategyProfit.value === 0) {
    return 0
  }
  return Math.round((strategyProfit.value / props.session.divCost) * 100) / 100
})

const divPerHour = computed(() => {
  if (!props.session.totalDuration || !props.session.divCost || strategyProfit.value === 0) {
    return 0
  }
  const hoursPlayed = props.session.totalDuration / (1000 * 60 * 60) // Convert ms to hours
  const divinesPerHour = profitInDivines.value / hoursPlayed
  return Math.round(divinesPerHour * 100) / 100
})

const divPerMap = computed(() => {
  if (!props.session.numberOfMaps || strategyProfit.value === 0) {
    return 0
  }
  return Math.round((profitInDivines.value / props.session.numberOfMaps) * 100) / 100
})

const formatDuration = (durationMs: number) => {
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

const formatChaos = (value: number) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const formatDivines = (value: number) => {
  return value.toFixed(2)
}
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle class="text-foreground">Session Analysis</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="space-y-3">
          <div>
            <span class="text-muted-foreground">Raw Returns:</span>
            <p class="font-semibold text-foreground">
              {{ formatChaos(session.totalReturns || 0) }}c
            </p>
          </div>
          <div>
            <span class="text-muted-foreground">Strategy Cost:</span>
            <p class="font-semibold text-foreground">{{ formatChaos(session.totalCost || 0) }}c</p>
          </div>
          <div>
            <span class="text-muted-foreground">Net Profit:</span>
            <p
              class="font-semibold"
              :class="
                strategyProfit >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ strategyProfit >= 0 ? '+' : '' }}{{ formatChaos(strategyProfit) }}c
            </p>
          </div>
          <div>
            <span class="text-muted-foreground">Number of maps:</span>
            <p class="font-semibold text-foreground">
              {{ session.numberOfMaps }}
            </p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <span class="text-muted-foreground">Total Duration:</span>
            <p class="font-semibold text-foreground">
              {{ formatDuration(session.totalDuration || 0) }}
            </p>
          </div>
          <div>
            <span class="text-muted-foreground">Profit in Divines:</span>
            <p class="font-semibold text-foreground">{{ formatDivines(profitInDivines) }}div</p>
          </div>
          <div>
            <span class="text-muted-foreground">Div per Hour:</span>
            <p class="font-semibold text-foreground">{{ formatDivines(divPerHour) }}div/h</p>
          </div>
          <div>
            <span class="text-muted-foreground">Div per Map:</span>
            <p class="font-semibold text-foreground">{{ formatDivines(divPerMap) }}div/map</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
