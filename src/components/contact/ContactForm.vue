<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import { toast } from 'vue-sonner'
import { Send, Mail } from 'lucide-vue-next'

const props = defineProps<{
  userId: string
}>()

const contactFormSchema = toTypedSchema(
  z.object({
    subject: z
      .string()
      .min(5, 'Subject must be at least 5 characters')
      .max(100, 'Subject must be less than 100 characters'),
    message: z
      .string()
      .min(20, 'Message must be at least 20 characters')
      .max(1000, 'Message must be less than 1000 characters'),
  }),
)

const form = useForm({
  validationSchema: contactFormSchema,
  initialValues: {
    subject: '',
    message: '',
  },
})

const submitMessage = useConvexMutation(api.contactMessages.submitContactMessage)

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const result = await submitMessage.mutate({
      userId: props.userId,
      subject: values.subject,
      message: values.message,
    })

    toast(result?.message || 'Message sent successfully!', {
      description: "We'll get back to you as soon as possible.",
    })

    form.resetForm()
  } catch (error) {
    console.error('Failed to submit contact message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'

    toast('Failed to send message', {
      description: errorMessage,
      class: 'bg-red-500 text-white',
      descriptionClass: 'text-white',
    })
  }
})

const isLoading = submitMessage.isLoading

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
  <Card class="shadow-sm rounded-2xl max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Mail class="h-5 w-5" />
        Contact Us
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="subject">
          <FormItem>
            <FormLabel class="text-card-foreground text-base font-bold">Subject</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Brief description of your inquiry..."
                class="w-full"
                maxlength="100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="message">
          <FormItem>
            <FormLabel class="text-card-foreground text-base font-bold"
              >Message
              <small class="text-sm"
                >Use <kbd class="p-1 bg-black text-white rounded-sm">Tab</kbd> to indent</small
              ></FormLabel
            >
            <FormControl>
              <Textarea
                v-bind="componentField"
                @keydown="handleKeydown"
                placeholder="Please describe your question or feedback in detail..."
                class="h-[200px] resize-none overflow-y-auto"
                maxlength="1000"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-between items-center">
          <p class="text-sm text-muted-foreground">You can send up to 2 messages per day</p>
          <Button
            type="submit"
            :disabled="!form.meta.value.valid || isLoading"
            class="flex items-center gap-2"
          >
            <Send class="h-4 w-4" />
            {{ isLoading ? 'Sending...' : 'Send Message' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
