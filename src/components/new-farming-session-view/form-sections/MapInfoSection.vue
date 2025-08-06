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
import type { FarmingSessionForm } from '@/composables/useFarmingSessionForm'

defineProps<{
  form: FarmingSessionForm
}>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Map info</h2>
    <FormField v-slot="{ value, handleChange }" name="isRandomMap">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Random Map</FormLabel>
          <FormDescription>
            Mark this if you're not farming a single map type but are instead rotating through many
            (such as Destructive Play).
            <strong>This will disable the map name field.</strong>
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="mapName">
      <FormItem>
        <FormLabel>Map Name</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Canyon..."
            v-bind="componentField"
            :disabled="form.values.isRandomMap"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ value, handleChange }" name="isOriginator">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Originator</FormLabel>
          <FormDescription>
            Mark this if your maps will be influenced by the Originator.
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <FormField v-slot="{ value, handleChange }" name="isSelfFarmed">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Is the map self-farmed?</FormLabel>
          <FormDescription>
            Mark this if you don't want to take into account the map cost.
            <strong>This will disable the map cost field.</strong>
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="mapCost">
      <FormItem>
        <FormLabel>Cost per map in chaos</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="10"
            v-bind="componentField"
            :disabled="form.values.isSelfFarmed"
            step="0.1"
            min="0.1"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="numberOfMaps">
      <FormItem>
        <FormLabel>Number of maps for the session</FormLabel>
        <FormControl>
          <Input type="number" placeholder="10" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
