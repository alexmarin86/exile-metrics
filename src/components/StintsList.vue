<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useConvexQuery, useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const queryArgs = computed(() => ({
  sessionId: props.session._id,
  userId: props.session.userId,
}))

const { data: stints, isLoading } = useConvexQuery(api.stints.getStintsBySession, queryArgs)

const deleteStint = useConvexMutation(api.stints.deleteStint)

const handleDeleteStint = async (stintId: string) => {
  try {
    await deleteStint.mutate({
      stintId: stintId as Doc<'Stint'>['_id'], // Proper type for Convex ID
      userId: props.session.userId,
    })
    toast('Stint deleted successfully', {
      description: 'The stint has been removed.',
    })
  } catch (error) {
    console.error('Failed to delete stint:', error)
    toast('Failed to delete stint', {
      description: 'Please try again later.',
      class: 'bg-red-500 text-white',
      descriptionClass: 'text-white',
    })
  }
}

function formatDuration(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const formatted = date.toLocaleDateString('en-US', options)

  const day = date.getDate()
  let suffix = 'th'
  if (day % 10 === 1 && day !== 11) suffix = 'st'
  else if (day % 10 === 2 && day !== 12) suffix = 'nd'
  else if (day % 10 === 3 && day !== 13) suffix = 'rd'

  return formatted.replace(/(\d+),/, `$1${suffix},`)
}

const totalDuration = computed(() => {
  if (!stints.value) return 0
  return stints.value.reduce((sum, stint) => sum + (stint.duration || 0), 0)
})
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        <span>Stints History</span>
        <Badge variant="secondary">{{ stints?.length || 0 }} completed</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="text-center py-8 text-muted-foreground">
        <p>Loading stints...</p>
      </div>

      <div
        v-else-if="!stints || stints.length === 0"
        class="text-center py-8 text-muted-foreground"
      >
        <p>No stints completed yet.</p>
        <p class="text-sm mt-1">Start your first stint using the timer!</p>
      </div>

      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead class="text-right">Duration</TableHead>
              <TableHead class="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="stint in stints" :key="stint._id">
              <TableCell class="font-medium">
                {{ formatDate(stint.createdAt) }}
              </TableCell>
              <TableCell>
                {{ formatTime(stint.startTime) }}
              </TableCell>
              <TableCell>
                {{ stint.endTime ? formatTime(stint.endTime) : 'In Progress' }}
              </TableCell>
              <TableCell class="text-right font-mono">
                {{ stint.duration ? formatDuration(stint.duration) : '--' }}
              </TableCell>
              <TableCell class="text-center">
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle class="text-foreground">Delete Stint</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this stint? This action cannot be undone.
                        The stint duration was
                        {{ stint.duration ? formatDuration(stint.duration) : 'unknown' }}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        class="bg-background text-foreground hover:bg-background/80 hover:text-foreground"
                        >Cancel</AlertDialogCancel
                      >
                      <AlertDialogAction
                        @click="handleDeleteStint(stint._id)"
                        class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="pt-4 border-t">
          <div class="flex justify-between items-center text-sm">
            <span class="text-muted-foreground">Total farming time:</span>
            <span class="font-mono font-semibold">
              {{ formatDuration(totalDuration) }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
