<script setup lang="ts">
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { completeSessionSchema, initialCompleteSessionValues } from '@/utils/farmingSessionSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface Props {
  sessionId: Id<'FarmingSession'>
  userId: string
  sessionName: string
}

const props = defineProps<Props>()

const completeMutation = useConvexMutation(api.farmingSessions.completeSession)

const form = useForm({
  validationSchema: completeSessionSchema,
  initialValues: initialCompleteSessionValues,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await completeMutation.mutate({
      sessionId: props.sessionId,
      userId: props.userId,
      totalReturns: values.totalReturns,
      divCost: values.divCost,
    })

    toast.success('Session completed successfully!')
  } catch (error) {
    console.error('Error completing session:', error)
    toast.error('Failed to complete session. Please try again.')
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>Complete Session</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-foreground">Complete Session</DialogTitle>
        <DialogDescription>
          Complete "{{ sessionName }}" by providing the final session data.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="totalReturns">
          <FormItem>
            <FormLabel class="text-foreground">Total Returns (Chaos Orbs)</FormLabel>
            <FormControl>
              <Input
                class="text-foreground"
                type="number"
                step="0.01"
                placeholder="20000"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="text-destructive" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="divCost">
          <FormItem>
            <FormLabel class="text-foreground">Current Divine Orb Cost</FormLabel>
            <FormControl>
              <Input
                class="text-foreground"
                type="number"
                step="0.01"
                placeholder="200"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="text-destructive" />
          </FormItem>
        </FormField>
        <DialogFooter>
          <DialogTrigger as-child>
            <Button
              type="button"
              variant="outline"
              class="bg-background text-foreground hover:bg-background/80 hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <Button type="submit" :disabled="completeMutation.isLoading.value">
            {{ completeMutation.isLoading.value ? 'Completing...' : 'Complete Session' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
