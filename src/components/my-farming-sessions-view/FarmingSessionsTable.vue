<script setup lang="ts">
import { useConvexQuery } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import { ExternalLink } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import LoadState from '@/components/state-components/LoadState.vue'
import ErrorState from '@/components/state-components/ErrorState.vue'
import EmptyState from '@/components/state-components/EmptyState.vue'
import Badge from '@/components/ui/badge/Badge.vue'

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
  <LoadState v-if="isLoading" loading-message="Loading your farming sessions..." />

  <ErrorState
    v-else-if="error"
    error-heading="Error Loading Sessions"
    :error-message="error.message"
    error-link="/sessions"
  />

  <EmptyState
    v-else-if="!sessions || sessions.length === 0"
    empty-heading="No Sessions Found"
    empty-message="You haven't created any farming sessions yet. Create your first session to get started!"
  />

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
            <Badge :variant="session.isConcluded ? 'secondary' : 'default'">
              {{ session.isConcluded ? 'Concluded' : 'Active' }}
            </Badge>
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
