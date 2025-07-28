<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { watch, ref, computed, onMounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const formSchema = toTypedSchema(
  z.object({
    //session info
    sessionName: z.string().min(2).max(50),
    sessionDescription: z.string().min(2).max(250),
    sessionNotes: z.string().max(250).optional(),
    //map info
    mapName: z.string().min(2).max(50),
    isRandomMap: z.boolean(),
    isOriginator: z.boolean(),
    isSelfFarmed: z.boolean(),
    mapCost: z.number().optional(),
    numberOfMaps: z.number().min(1).max(1000),
    //chisels info
    isUsingChisels: z.boolean(),
    chiselName: z.string().min(2).max(50),
    chiselPrice: z.number().optional(),
    //scarabs info
    isUsingScarabs: z.boolean(),
    scarabs: z.array(
      z.object({
        name: z.string().min(2).max(50),
        quantity: z.number().min(1).max(5),
        price: z.number().refine((val) => val >= 0.1, {
          message: 'Price must be at least 0.1',
        }),
      }),
    ),
    //map device craft info
    isUsingMapCraft: z.boolean(),
    mapCraftName: z.string().max(50).optional(),
    mapCraftPrice: z.number().optional(),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    sessionName: '',
    sessionDescription: '',
    sessionNotes: '',
    mapName: '',
    isRandomMap: false,
    isOriginator: false,
    isSelfFarmed: false,
    mapCost: undefined,
    numberOfMaps: 1,
    isUsingChisels: true,
    chiselName: "Cartographer's Chisel",
    chiselPrice: undefined,
    isUsingScarabs: true,
    scarabs: [],
    isUsingMapCraft: true,
    mapCraftName: '',
    mapCraftPrice: undefined,
  },
})

const onSubmit = form.handleSubmit((values) => {
  const totalQuantity = values.scarabs.reduce((sum, s) => sum + s.quantity, 0)
  if (totalQuantity > 5) {
    alert('Total scarab quantity cannot exceed 5.')
    return
  }
  console.log('Form submitted!', values)
})

const scarabs = ref(form.values.scarabs)

//form state change watchers
watch(
  () => form.values.isRandomMap,
  (newVal) => {
    if (newVal === true) {
      form.setFieldValue('mapName', 'random') // or ''
    } else {
      form.setFieldValue('mapName', '')
    }
  },
)
watch(
  () => form.values.scarabs,
  (newVal) => {
    scarabs.value = newVal
  },
)

function addScarabRow() {
  const current = form.values.scarabs ?? []
  form.setFieldValue('scarabs', [...current, { name: '', quantity: 1, price: 0 }])
}

function removeScarabRow(index: number) {
  const current = form.values.scarabs ?? []
  const updated = [...current]
  updated.splice(index, 1)
  form.setFieldValue('scarabs', updated)
}
const totalScarabQuantity = computed(() =>
  (form.values.scarabs ?? []).reduce((sum, s) => sum + (s.quantity || 0), 0),
)

onMounted(() => {
  if (!form.values.scarabs || form.values.scarabs.length === 0) {
    form.setFieldValue('scarabs', [{ name: '', quantity: 1, price: 0 }])
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:gap-12 mb-12">
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
              Enter a brief description of the farming strategy you're using.
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
              Additional notes about the farming strategy. If nothing comes to mind, don't worry,
              you'll be able to edit this later.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="space-y-4">
        <h2 class="text-xl font-bold">Map info</h2>
        <FormField v-slot="{ value, handleChange }" name="isRandomMap">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">Random Map</FormLabel>
              <FormDescription>
                Mark this if you're not farming a single map type but are instead rotating through
                many (such as Destructive Play).
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
      <div class="space-y-4">
        <h2 class="text-xl font-bold">Chisels and map craft info</h2>
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
              <FormLabel>Chisel Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                  :disabled="!form.values.isUsingChisels"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="chiselPrice">
            <FormItem>
              <FormLabel>Chisel Price per Unit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  v-bind="componentField"
                  :disabled="!form.values.isUsingChisels"
                  step="0.1"
                  min="0.1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField v-slot="{ value, handleChange }" name="isUsingMapCraft">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">Are you using a map device craft?</FormLabel>
              <FormDescription>
                Unmarking this will disable the map craft related fields.
              </FormDescription>
            </div>
            <FormControl>
              <Switch :model-value="value" @update:model-value="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="mapCraftName">
            <FormItem>
              <FormLabel>Map Craft Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                  placeholder="Anarchy..."
                  :disabled="!form.values.isUsingMapCraft"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="chiselPrice">
            <FormItem>
              <FormLabel>Map Craft Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  v-bind="componentField"
                  :disabled="!form.values.isUsingMapCraft"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
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
        <div
          v-for="(scarab, index) in form.values.scarabs"
          :key="index"
          class="flex gap-4 items-end"
        >
          <div class="grid grid-cols-3 gap-4">
            <FormField :name="`scarabs[${index}].name`" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Kalguuran Scarab" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField :name="`scarabs[${index}].quantity`" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1" max="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField :name="`scarabs[${index}].price`" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" min="0.1" step="0.1" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button type="button" variant="destructive" @click="removeScarabRow(index)">
            <Trash2 />
            <span class="sr-only">Remove</span>
          </Button>
        </div>
        <Button
          type="button"
          @click="addScarabRow"
          :disabled="!form.values.isUsingScarabs || totalScarabQuantity >= 5"
        >
          Add Scarab Row
        </Button>
      </div>
    </div>
    <Button type="submit" class="ml-auto mr-6 block">Submit</Button>
  </form>
</template>
