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
import { toast } from 'vue-sonner'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()

const sessionNotesSchema = toTypedSchema(
  z.object({
    sessionNotes: z.string(),
  }),
)

const form = useForm({
  validationSchema: sessionNotesSchema,
  initialValues: {
    sessionNotes: props.session.sessionNotes || '',
  },
})

const updateNotes = useConvexMutation(api.farmingSessions.updateSessionNotes)

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await updateNotes.mutate({
      sessionId: props.session._id,
      userId: props.session.userId,
      sessionNotes: values.sessionNotes,
    })
    toast('Notes saved successfully', {
      description: 'Your changes have been saved.',
    })
  } catch (error) {
    console.error('Failed to save notes:', error)
    toast('Failed to save notes', {
      description: 'Please try again later.',
      class: 'bg-red-500 text-white',
      descriptionClass: 'text-white',
    })
  }
})

const isLoading = updateNotes.isLoading

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    const value = target.value
    target.value = value.substring(0, start) + '\t' + value.substring(end)

    target.selectionStart = target.selectionEnd = start + 1

    target.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
</script>

<template>
  <Card class="shadow-sm rounded-2xl">
    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="sessionNotes">
          <FormItem>
            <FormLabel class="text-card-foreground text-base font-bold"
              >Session Notes
              <small class="text-sm"
                >Use <kbd class="p-1 bg-black text-white rounded-sm">Tab</kbd> to indent</small
              ></FormLabel
            >
            <FormControl>
              <Textarea
                v-bind="componentField"
                @keydown="handleKeydown"
                placeholder="Running this with a support so the proceeds will be split..."
                class="h-[120px] resize-none overflow-y-auto"
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
