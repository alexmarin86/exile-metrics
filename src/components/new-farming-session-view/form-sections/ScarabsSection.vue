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
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { Trash2, Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed } from 'vue'
import type { GenericForm, FullFormData } from '@/types/FormTypes'
import { SCARAB_NAMES } from '@/consts/scarabNames'
import { cn } from '@/lib/utils'

const props = defineProps<{
  form: GenericForm<FullFormData>
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

// Transform scarab names into the format expected by the combobox
const scarabOptions = SCARAB_NAMES.map((name) => ({ label: name, value: name }))
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
      <div class="grid grid-cols-4 gap-4">
        <FormField :name="`scarabs[${index}].name`" v-slot="{ componentField }">
          <FormItem class="col-span-2">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Combobox
                by="value"
                :disabled="!form.values.isUsingScarabs"
                :model-value="scarabOptions.find((opt) => opt.value === componentField.modelValue)"
                @update:model-value="
                  (val: any) => componentField['onUpdate:modelValue']?.(val?.value || '')
                "
              >
                <ComboboxAnchor>
                  <div class="relative w-full items-center">
                    <ComboboxInput
                      :display-value="(val) => val?.label ?? componentField.modelValue ?? ''"
                      placeholder="Select scarab..."
                    />
                    <ComboboxTrigger
                      class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                    >
                      <ChevronsUpDown class="size-4 text-muted-foreground" />
                    </ComboboxTrigger>
                  </div>
                </ComboboxAnchor>

                <ComboboxList>
                  <ComboboxEmpty> No scarab found. </ComboboxEmpty>

                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="option in scarabOptions"
                      :key="option.value"
                      :value="option"
                    >
                      {{ option.label }}

                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
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
