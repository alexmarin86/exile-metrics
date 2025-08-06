<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square } from 'lucide-vue-next'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { toast } from 'vue-sonner'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const createStint = useConvexMutation(api.stints.createStint)

const isRunning = ref(false)
const isPaused = ref(false)
const currentTime = ref(0)
const startTimestamp = ref(0)
const pausedTime = ref(0)
const lastPauseTimestamp = ref(0)

let timerInterval: number | null = null
let saveInterval: number | null = null

const storageKey = `timer_${props.session._id}`

interface TimerState {
  isRunning: boolean
  isPaused: boolean
  startTimestamp: number
  pausedTime: number
  lastPauseTimestamp: number
}

const saveTimerState = () => {
  const state: TimerState = {
    isRunning: isRunning.value,
    isPaused: isPaused.value,
    startTimestamp: startTimestamp.value,
    pausedTime: pausedTime.value,
    lastPauseTimestamp: lastPauseTimestamp.value,
  }
  localStorage.setItem(storageKey, JSON.stringify(state))
}

const loadTimerState = () => {
  const saved = localStorage.getItem(storageKey)
  if (!saved) return false

  try {
    const state: TimerState = JSON.parse(saved)

    if (!state.isRunning) return false

    startTimestamp.value = state.startTimestamp
    pausedTime.value = state.pausedTime
    lastPauseTimestamp.value = state.lastPauseTimestamp
    isRunning.value = state.isRunning
    isPaused.value = state.isPaused

    if (state.isPaused && state.lastPauseTimestamp) {
      const now = Date.now()
      pausedTime.value += now - state.lastPauseTimestamp
      lastPauseTimestamp.value = now
    }

    return true
  } catch (error) {
    console.error('Failed to load timer state:', error)
    localStorage.removeItem(storageKey)
    return false
  }
}

const updateCurrentTime = () => {
  if (!isRunning.value) {
    currentTime.value = 0
    return
  }

  const now = Date.now()
  let elapsed = now - startTimestamp.value

  if (isPaused.value && lastPauseTimestamp.value) {
    elapsed -= now - lastPauseTimestamp.value + pausedTime.value
  } else {
    elapsed -= pausedTime.value
  }

  currentTime.value = Math.max(0, Math.floor(elapsed / 1000))
}

const startIntervals = () => {
  timerInterval = setInterval(updateCurrentTime, 1000)
  saveInterval = setInterval(saveTimerState, 30000)
}

const clearIntervals = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
  }
}

const startTimer = () => {
  const now = Date.now()

  if (!isRunning.value) {
    startTimestamp.value = now
    pausedTime.value = 0
    lastPauseTimestamp.value = 0
  }

  isRunning.value = true
  isPaused.value = false

  startIntervals()
  saveTimerState()
}

const pauseTimer = () => {
  const now = Date.now()

  if (isPaused.value) {
    if (lastPauseTimestamp.value) {
      pausedTime.value += now - lastPauseTimestamp.value
    }
    isPaused.value = false
    lastPauseTimestamp.value = 0
  } else {
    isPaused.value = true
    lastPauseTimestamp.value = now
  }

  saveTimerState()
}

const stopTimer = async () => {
  if (!isRunning.value || !props.session.userId) {
    resetTimerState()
    return
  }

  const now = Date.now()
  const endTime = now

  let totalDuration = endTime - startTimestamp.value

  if (isPaused.value && lastPauseTimestamp.value) {
    pausedTime.value += now - lastPauseTimestamp.value
  }

  totalDuration -= pausedTime.value

  if (totalDuration > 1000) {
    try {
      await createStint.mutate({
        sessionId: props.session._id,
        userId: props.session.userId,
        startTime: startTimestamp.value,
        endTime: endTime,
        duration: totalDuration,
      })

      toast('Stint saved successfully', {
        description: `Duration: ${formatTime(Math.floor(totalDuration / 1000))}`,
      })
    } catch (error) {
      console.error('Failed to save stint:', error)
      toast.error('Failed to save stint', {
        description: 'Please try again later.',
        class: 'bg-red-500 text-white',
        descriptionClass: 'text-white',
      })
    }
  }

  resetTimerState()
}

const resetTimerState = () => {
  isRunning.value = false
  isPaused.value = false
  currentTime.value = 0
  startTimestamp.value = 0
  pausedTime.value = 0
  lastPauseTimestamp.value = 0

  clearIntervals()
  localStorage.removeItem(storageKey)
}

onMounted(() => {
  const restored = loadTimerState()
  if (restored && isRunning.value) {
    startIntervals()
    updateCurrentTime()
  }
})

onUnmounted(() => {
  if (isRunning.value) {
    saveTimerState()
  }
  clearIntervals()
})

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle>Current Stint</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="text-center">
        <div class="text-4xl font-mono font-bold text-primary">
          {{ formatTime(currentTime) }}
        </div>
      </div>
      <div class="flex justify-center gap-3">
        <Button v-if="!isRunning" @click="startTimer" class="flex items-center gap-2" size="lg">
          <Play class="h-4 w-4" />
          Start
        </Button>
        <template v-else>
          <Button
            @click="pauseTimer"
            :variant="isPaused ? 'default' : 'secondary'"
            class="flex items-center gap-2"
            size="lg"
          >
            <Pause v-if="!isPaused" class="h-4 w-4" />
            <Play v-else class="h-4 w-4" />
            {{ isPaused ? 'Resume' : 'Pause' }}
          </Button>
          <Button
            @click="stopTimer"
            variant="destructive"
            class="flex items-center gap-2"
            size="lg"
          >
            <Square class="h-4 w-4" />
            Stop
          </Button>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
