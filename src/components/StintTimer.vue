<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square } from 'lucide-vue-next'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

// Convex mutation
const createStint = useConvexMutation(api.stints.createStint)

// Timer state
const isRunning = ref(false)
const isPaused = ref(false)
const currentTime = ref(0)
const startTimestamp = ref(0)
const pausedTime = ref(0)
const lastPauseTimestamp = ref(0)

// Timer intervals
let timerInterval: number | null = null
let saveInterval: number | null = null

// localStorage key for this session
const storageKey = `timer_${props.session._id}`

// Timer state interface for localStorage
interface TimerState {
  isRunning: boolean
  isPaused: boolean
  startTimestamp: number
  pausedTime: number
  lastPauseTimestamp: number
}

// Save timer state to localStorage
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

// Load timer state from localStorage
const loadTimerState = () => {
  const saved = localStorage.getItem(storageKey)
  if (!saved) return false

  try {
    const state: TimerState = JSON.parse(saved)

    // Only restore if timer was running
    if (!state.isRunning) return false

    startTimestamp.value = state.startTimestamp
    pausedTime.value = state.pausedTime
    lastPauseTimestamp.value = state.lastPauseTimestamp
    isRunning.value = state.isRunning
    isPaused.value = state.isPaused

    // If timer was paused when saved, add the time since last save to pausedTime
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

// Update current time display
const updateCurrentTime = () => {
  if (!isRunning.value) {
    currentTime.value = 0
    return
  }

  const now = Date.now()
  let elapsed = now - startTimestamp.value

  // Subtract paused time
  if (isPaused.value && lastPauseTimestamp.value) {
    elapsed -= now - lastPauseTimestamp.value + pausedTime.value
  } else {
    elapsed -= pausedTime.value
  }

  currentTime.value = Math.max(0, Math.floor(elapsed / 1000))
}

// Start timer intervals
const startIntervals = () => {
  // Update timer display every second
  timerInterval = setInterval(updateCurrentTime, 1000)

  // Save to localStorage every 30 seconds
  saveInterval = setInterval(saveTimerState, 30000)
}

// Clear timer intervals
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

// Timer methods
const startTimer = () => {
  const now = Date.now()

  if (!isRunning.value) {
    // Starting fresh timer
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
    // Resuming from pause
    if (lastPauseTimestamp.value) {
      pausedTime.value += now - lastPauseTimestamp.value
    }
    isPaused.value = false
    lastPauseTimestamp.value = 0
  } else {
    // Pausing
    isPaused.value = true
    lastPauseTimestamp.value = now
  }

  saveTimerState()
}

const stopTimer = async () => {
  if (!isRunning.value || !props.session.userId) {
    // Reset timer state without saving if not running or no userId
    resetTimerState()
    return
  }

  const now = Date.now()
  const endTime = now

  // Calculate final duration
  let totalDuration = endTime - startTimestamp.value

  // Add any current pause time if paused
  if (isPaused.value && lastPauseTimestamp.value) {
    pausedTime.value += now - lastPauseTimestamp.value
  }

  // Subtract total paused time from duration
  totalDuration -= pausedTime.value

  // Only save if the stint has meaningful duration (more than 1 second)
  if (totalDuration > 1000) {
    try {
      await createStint.mutate({
        sessionId: props.session._id,
        userId: props.session.userId,
        startTime: startTimestamp.value,
        endTime: endTime,
        duration: totalDuration,
      })

      console.log('Stint saved successfully')
    } catch (error) {
      console.error('Failed to save stint:', error)
      // TODO: Could show a toast notification here
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

// Lifecycle hooks
onMounted(() => {
  // Try to restore timer state on component mount
  const restored = loadTimerState()
  if (restored && isRunning.value) {
    startIntervals()
    updateCurrentTime()
  }
})

onUnmounted(() => {
  // Clean up intervals and save state before unmounting
  if (isRunning.value) {
    saveTimerState()
  }
  clearIntervals()
})

// Format time display (placeholder)
const formatTime = (seconds: number) => {
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
