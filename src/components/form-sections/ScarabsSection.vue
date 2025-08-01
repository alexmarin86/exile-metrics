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
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'
import { computed } from 'vue'
import type { FarmingSessionForm } from '@/composables/useFarmingSessionForm'

const props = defineProps<{
  form: FarmingSessionForm
}>()

defineEmits<{
  addScarabRow: []
  removeScarabRow: [index: number]
}>()

const totalScarabQuantity = computed(() =>
  (props.form.values.scarabs ?? []).reduce(
    (sum: number, s: { quantity?: number }) => sum + (s.quantity || 0),
    0,
  ),
)
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Scarabs info</h2>
    <FormField v-slot="{ value, handleChange }" name="isUsingScarabs">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Are you using scarabs or fragments?</FormLabel>
          <FormDescription>
            Unmarking this will disable scarab related fields and button.
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <div v-for="(scarab, index) in form.values.scarabs" :key="index" class="flex gap-4 items-end">
      <div class="grid grid-cols-3 gap-4">
        <FormField :name="`scarabs[${index}].name`" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Kalguuran Scarab"
                :disabled="!form.values.isUsingScarabs"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField :name="`scarabs[${index}].quantity`" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="number"
                min="1"
                max="5"
                :disabled="!form.values.isUsingScarabs"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField :name="`scarabs[${index}].price`" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                v-bind="componentField"
                :disabled="!form.values.isUsingScarabs"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button type="button" variant="destructive" @click="$emit('removeScarabRow', index)">
        <Trash2 />
        <span class="sr-only">Remove</span>
      </Button>
    </div>
    <Button
      type="button"
      @click="$emit('addScarabRow')"
      :disabled="!form.values.isUsingScarabs || totalScarabQuantity >= 5"
    >
      Add Scarab Row
    </Button>
  </div>
</template>
