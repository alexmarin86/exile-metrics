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

defineProps<{
  form: GenericForm<FullFormData>
}>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Chisels info</h2>
    <FormField v-slot="{ value, handleChange }" name="isUsingChisels">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel class="text-base">Are you using chisels?</FormLabel>
          <FormDescription>
            Unmarking this will disable the chisels related fields.
          </FormDescription>
        </div>
        <FormControl>
          <Switch :model-value="value" @update:model-value="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="chiselName">
        <FormItem>
          <FormLabel>Chisel Type</FormLabel>
          <FormControl>
            <Select v-bind="componentField" :disabled="!form.values.isUsingChisels">
              <SelectTrigger>
                <SelectValue placeholder="Choose a chisel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Maven's Chisel of Avarice">
                    Maven's Chisel of Avarice
                  </SelectItem>
                  <SelectItem value="Maven's Chisel of Divination">
                    Maven's Chisel of Divination
                  </SelectItem>
                  <SelectItem value="Maven's Chisel of Procurement">
                    Maven's Chisel of Procurement
                  </SelectItem>
                  <SelectItem value="Maven's Chisel of Proliferation">
                    Maven's Chisel of Proliferation
                  </SelectItem>
                  <SelectItem value="Maven's Chisel of Scarabs">
                    Maven's Chisel of Scarabs
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="chiselPrice">
        <FormItem>
          <FormLabel>Chisel Price per Unit</FormLabel>
          <FormControl>
            <Input type="number" placeholder="10" v-bind="componentField" :disabled="!form.values.isUsingChisels"
              step="0.01" min="0.1" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
