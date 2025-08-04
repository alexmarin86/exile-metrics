<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUser } from '@clerk/vue'
import { useConvexQuery } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import SessionInfoSection from '@/components/SessionInfoSection.vue'
import StintsSection from '@/components/StintsSection.vue'
import { computed } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'

const route = useRoute()
const rawId = route.params.id
if (typeof rawId !== 'string') {
  throw new Error('Invalid session id')
}
const sessionId = rawId as Id<'FarmingSession'>

const { user, isLoaded } = useUser()
const userId = computed(() => user.value?.id)

const queryArgs = computed(() => ({
  farmingSessionId: sessionId,
  userId: user.value?.id ?? '',
}))

const { data: sessionData, isLoading } = useConvexQuery(
  api.farmingSessions.getFarmingSessionByIdAndUser,
  queryArgs,
  {
    enabled: computed(() => isLoaded && !!user.value?.id),
  },
)

const isWorking = computed(() => !isLoaded.value || isLoading.value)
</script>

<template>
  <main class="container mx-auto space-y-8">
    <h1 class="text-2xl font-bold">Current Farming Session</h1>

    <div v-if="isWorking" class="flex items-center justify-center h-[60vh]">
      <LoaderCircle class="h-10 w-10 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="!userId" class="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <p class="font-medium">You are not authorized to view this content.</p>
    </div>

    <div v-else-if="!sessionData" class="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <p class="font-medium">Session not found.</p>
    </div>

    <div v-else class="space-y-8">
      <StintsSection :session="sessionData" />
      <SessionInfoSection :session="sessionData" />
    </div>
  </main>
</template>
