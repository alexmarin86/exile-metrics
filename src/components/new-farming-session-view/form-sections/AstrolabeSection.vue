<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { GenericForm, FullFormData } from '@/types/FormTypes'
import { ASTROLABE_NAMES } from '@/consts/astrolabeNames'

defineProps<{
  form: GenericForm<FullFormData>
}>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Astrolabe info</h2>
    <FormField v-slot="{ value, handleChange }" name="isUsingAstrolabe">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Are you using an astrolabe?</FormLabel>
          <FormDescription>
            Astrolabes add Shaped Regions to the Atlas, affecting many maps in a quadrant.
          </FormDescription>
          <FormDescription class="text-yellow-600 dark:text-yellow-500 font-medium">
            Note: Current cost calculation does not account for astrolabe durability. Astrolabes run out after a certain
            number of maps (exact value TBD).
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="astrolabeName">
        <FormItem>
          <FormLabel>Astrolabe Type</FormLabel>
          <FormControl>
            <Select v-bind="componentField" :disabled="!form.values.isUsingAstrolabe">
              <SelectTrigger>
                <SelectValue placeholder="Choose an astrolabe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="name in ASTROLABE_NAMES" :key="name" :value="name">
                    {{ name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="astrolabePrice">
        <FormItem>
          <FormLabel>Astrolabe Price per Unit</FormLabel>
          <FormControl>
            <Input type="number" placeholder="50" v-bind="componentField" :disabled="!form.values.isUsingAstrolabe"
              step="0.01" min="0.1" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
