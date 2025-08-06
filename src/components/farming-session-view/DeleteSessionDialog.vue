<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { toast } from 'vue-sonner'
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
import { Button } from '@/components/ui/button'

interface Props {
  sessionId: Id<'FarmingSession'>
  userId: string
  sessionName: string
}

const props = defineProps<Props>()

const router = useRouter()

const deleteMutation = useConvexMutation(api.farmingSessions.deleteFarmingSession)

const handleDelete = async () => {
  if (deleteMutation.isLoading.value) return

  try {
    await deleteMutation.mutate({
      sessionId: props.sessionId,
      userId: props.userId,
    })

    toast.success('Session deleted successfully')

    // Navigate back to sessions list
    router.push('/sessions')
  } catch (error) {
    console.error('Error deleting session:', error)
    toast.error('Failed to delete session. Please try again.')
  }
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button
        variant="outline"
        class="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        Delete Session
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="text-foreground">Delete Session</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete "{{ sessionName }}"? This will permanently delete the
          session and all associated stints. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          class="bg-background text-foreground hover:bg-background/80 hover:text-foreground"
          >Cancel</AlertDialogCancel
        >
        <AlertDialogAction
          @click="handleDelete"
          :disabled="deleteMutation.isLoading.value"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {{ deleteMutation.isLoading.value ? 'Deleting...' : 'Delete Session' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
