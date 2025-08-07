<script setup lang="ts">
import { useUser } from '@clerk/vue'
import FarmingSessionsTable from '@/components/my-farming-sessions-view/FarmingSessionsTable.vue'
import LoadState from '@/components/state-components/LoadState.vue'
import NotAuthedState from '@/components/state-components/NotAuthedState.vue'
import { Eye } from 'lucide-vue-next'

const { isSignedIn, user, isLoaded } = useUser()
</script>

<template>
  <main class="container mx-auto space-y-8">
    <h1 class="text-2xl font-bold">My Farming Sessions</h1>

    <LoadState loadingMessage="Loading user data..." v-if="!isLoaded" />

    <NotAuthedState
      v-else-if="!isSignedIn"
      unauthedHeading="Please Log In"
      unauthedMessage="You need to be logged in to view your farming sessions."
    />

    <div v-else class="space-y-6">
      <div
        class="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg p-4"
      >
        <div class="flex items-center space-x-2">
          <Eye class="h-5 w-5 text-primary-500" />
          <span class="text-primary-700 dark:text-primary-300 font-medium">
            Browse your sessions in the table below by clicking the link in the name column.
          </span>
        </div>
        <p>Filters coming soon!</p>
      </div>

      <FarmingSessionsTable v-if="user?.id" :user-id="user.id" />
    </div>
  </main>
</template>
