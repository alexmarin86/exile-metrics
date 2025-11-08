<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart } from '@/components/ui/chart-bar'
import LoadState from '@/components/state-components/LoadState.vue'
import type { Doc } from '../../../convex/_generated/dataModel'
import { computed } from 'vue'
import { useConvexQuery } from '@convex-vue/core'
import { api } from '@convex/_generated/api'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const currentStrategyDivPerHour = computed(() => {
  if (
    !props.session.totalReturns ||
    !props.session.totalDuration ||
    !props.session.divCost
  ) {
    return 0
  }
  const strategyProfit = props.session.totalCost ? props.session.totalReturns - props.session.totalCost : props.session.totalReturns
  const profitInDivines = strategyProfit / props.session.divCost
  const oneHourInMs = 1000 * 60 * 60
  const hoursPlayed = props.session.totalDuration / oneHourInMs
  const divinesPerHour = profitInDivines / hoursPlayed
  return Math.round(divinesPerHour * 100) / 100
})

const { data: completedSessions, isLoading } = useConvexQuery(
  api.farmingSessions.getUsersCompletedSessions,
  { userId: props.session.userId },
)

const otherSessions = computed(() => {
  return completedSessions.value?.filter((session) => session._id !== props.session._id) || []
})

function getDivPerMap(session: FarmingSession): number {
  if (!session.numberOfMaps || session.numberOfMaps === 0) return 0
  if (!session.totalReturns) return 0
  if (!session.divCost) return 0
  const profitInDivines = (session.totalReturns - (session.totalCost ?? 0)) / session.divCost
  return Math.round((profitInDivines / session.numberOfMaps) * 100) / 100
}

function getDivPerHour(session: FarmingSession): number {
  if (!session.totalDuration || session.totalDuration === 0) return 0
  if (!session.totalReturns || !session.totalCost) return 0
  if (!session.divCost) return 0
  const oneHourInMs = 1000 * 60 * 60
  const hoursPlayed = session.totalDuration / oneHourInMs
  const profitInDivines = (session.totalReturns - session.totalCost) / session.divCost
  return Math.round((profitInDivines / hoursPlayed) * 100) / 100
}

const chartData = computed(() => {
  if (!completedSessions.value) return []

  const data = [
    {
      name: props.session.sessionName,
      divPerHour: currentStrategyDivPerHour.value,
      divPerMap: getDivPerMap(props.session),
    },
  ]

  for (const session of otherSessions.value) {
    data.push({
      name: session.sessionName,
      divPerHour: getDivPerHour(session),
      divPerMap: getDivPerMap(session),
    })
  }

  return data
})
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle class="text-foreground text-lg font-semibold">Strategy Comparison
        <small class="text-muted-foreground ml-2">* Chart is in alpha, will fix asap</small>
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <LoadState v-if="isLoading" loading-message="Loading farming sessions..." />
      <div v-else class="space-y-3">
        <BarChart v-if="chartData.length > 0" :data="chartData" index="name" :categories="['divPerHour', 'divPerMap']"
          :colors="['var(--primary)', 'var(--accent)']" :y-formatter="(tick, i) => {
            return typeof tick === 'number'
              ? `${new Intl.NumberFormat('us').format(tick).toString()} div`
              : ''
          }
            " class="h-[280px]" :show-x-axis="true" :show-y-axis="true" />

        <div v-else class="flex items-center justify-center py-8">
          <span class="text-muted-foreground">No session data available for comparison</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
