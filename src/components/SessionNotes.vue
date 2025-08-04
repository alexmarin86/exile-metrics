<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

// Form schema
const sessionNotesSchema = toTypedSchema(
  z.object({
    sessionNotes: z.string(),
  }),
)

// Form setup
const form = useForm({
  validationSchema: sessionNotesSchema,
  initialValues: {
    sessionNotes: props.session.sessionNotes || '',
  },
})

// Update notes mutation
const updateNotes = useConvexMutation(api.farmingSessions.updateSessionNotes)

// Form submission
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await updateNotes.mutate({
      sessionId: props.session._id,
      userId: props.session.userId,
      sessionNotes: values.sessionNotes,
    })
    console.log('Notes saved successfully')
  } catch (error) {
    console.error('Failed to save notes:', error)
    // TODO: Could show a toast notification here
  }
})

const isLoading = updateNotes.isLoading
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="sessionNotes">
          <FormItem>
            <FormLabel class="text-card-foreground text-base font-bold">Session Notes</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Running this with a support so the proceeds will be split..."
                class="min-h-[120px] resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end">
          <Button
            type="submit"
            :disabled="!form.meta.value.dirty || isLoading"
            class="flex items-center gap-2"
            size="sm"
          >
            {{ isLoading ? 'Saving...' : 'Save Notes' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
