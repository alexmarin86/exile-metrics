<script setup lang="ts">
import { useUser } from '@clerk/vue'
import { Loader2 } from 'lucide-vue-next'
import FarmingSessionsTable from '@/components/FarmingSessionsTable.vue'

const { isSignedIn, user, isLoaded } = useUser()
</script>

<template>
  <main class="container mx-auto space-y-8">
    <h1 class="text-2xl font-bold">My Farming Sessions</h1>

    <!-- Loading state -->
    <div v-if="!isLoaded" class="flex items-center justify-center py-12">
      <div class="flex items-center space-x-2">
        <Loader2 class="h-6 w-6 animate-spin" />
        <span class="text-muted-foreground">Loading user data...</span>
      </div>
    </div>

    <!-- Not authenticated state -->
    <div v-else-if="!isSignedIn" class="text-center py-12">
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-muted-foreground">Please Log In</h2>
        <p class="text-muted-foreground">You need to be logged in to view your farming sessions.</p>
      </div>
    </div>

    <!-- Authenticated state -->
    <div v-else class="space-y-6">
      <div
        class="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4"
      >
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 bg-green-500 rounded-full"></div>
          <span class="text-green-700 dark:text-green-300 font-medium">
            Welcome back, {{ user?.firstName || user?.emailAddresses?.[0]?.emailAddress }}!
          </span>
        </div>
        <p class="text-green-600 dark:text-green-400 text-sm mt-1">
          Successfully authenticated. Your farming sessions will appear here.
        </p>
      </div>

      <!-- Farming Sessions Table -->
      <FarmingSessionsTable v-if="user?.id" :user-id="user.id" />
    </div>
  </main>
</template>
