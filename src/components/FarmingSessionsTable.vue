<script setup lang="ts">
import { useConvexQuery } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { Loader2, ExternalLink } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  userId: string
}>()

const {
  data: sessions,
  isLoading,
  error,
} = useConvexQuery(api.farmingSessions.getFarmingSessionsByUser, {
  userId: props.userId,
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex items-center justify-center py-12">
    <div class="flex items-center space-x-2">
      <Loader2 class="h-6 w-6 animate-spin" />
      <span class="text-muted-foreground">Loading your farming sessions...</span>
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="text-center py-12">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-destructive">Error Loading Sessions</h3>
      <p class="text-muted-foreground">{{ error.message }}</p>
    </div>
  </div>

  <!-- Empty state -->
  <div v-else-if="!sessions || sessions.length === 0" class="text-center py-12">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-muted-foreground">No Sessions Found</h3>
      <p class="text-muted-foreground">
        You haven't created any farming sessions yet. Create your first session to get started!
      </p>
    </div>
  </div>

  <!-- Data table -->
  <div v-else class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session Name</TableHead>
          <TableHead>Map Name</TableHead>
          <TableHead>Originator</TableHead>
          <TableHead># Maps</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Total Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="session in sessions" :key="session._id">
          <TableCell class="font-medium">
            <RouterLink
              :to="`/sessions/${session._id}`"
              class="flex items-center gap-2 text-primary hover:underline"
            >
              {{ session.sessionName }}
              <ExternalLink class="h-3 w-3" />
            </RouterLink>
          </TableCell>
          <TableCell>
            <span v-if="session.isRandomMap" class="italic text-muted-foreground">Random</span>
            <span v-else>{{ session.mapName }}</span>
          </TableCell>
          <TableCell>
            <span :class="session.isOriginator ? 'text-green-600' : 'text-muted-foreground'">
              {{ session.isOriginator ? 'Yes' : 'No' }}
            </span>
          </TableCell>
          <TableCell>{{ session.numberOfMaps }}</TableCell>
          <TableCell>
            <span
              :class="
                session.isConcluded
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              "
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ session.isConcluded ? 'Concluded' : 'Active' }}
            </span>
          </TableCell>
          <TableCell class="text-right">
            <span v-if="session.totalCost">{{ session.totalCost.toFixed(2) }} chaos</span>
            <span v-else class="text-muted-foreground">-</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
