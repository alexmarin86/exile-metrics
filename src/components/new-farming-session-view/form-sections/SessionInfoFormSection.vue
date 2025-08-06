<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb } from 'lucide-vue-next'
import type { FarmingSessionForm } from '@/composables/useFarmingSessionForm'

defineProps<{
  form: FarmingSessionForm
}>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Session info</h2>
    <FormField v-slot="{ componentField }" name="sessionName">
      <FormItem>
        <FormLabel>Session Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="big exiles..." v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="sessionDescription">
      <FormItem>
        <FormLabel>Session Description</FormLabel>
        <FormControl>
          <Textarea
            v-bind="componentField"
            placeholder="Strategy relies on scarab x to farm..."
            class="lg:h-36"
          />
        </FormControl>
        <FormDescription>
          Enter a brief description of the farming strategy you're using. <br />
          <Lightbulb class="h-4 w-4 inline" /> Hint: you can paste links and they will automatically
          be clickable in the Session page!
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="sessionNotes">
      <FormItem>
        <FormLabel>Session Notes</FormLabel>
        <FormControl>
          <Textarea
            v-bind="componentField"
            placeholder="Running this with a support so the proceeds will be split..."
            class="lg:h-36"
          />
        </FormControl>
        <FormDescription>
          Additional notes about the farming strategy. If nothing comes to mind, don't worry, you'll
          be able to edit this later.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
