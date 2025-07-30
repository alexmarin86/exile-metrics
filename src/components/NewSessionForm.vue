<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
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
import CostSummary from '@/components/CostSummary.vue'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { watch, ref, computed, onMounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/vue'

const ChiselNames = z.enum([
  "Cartographer's Chisel",
  "Maven's Chisel of Avarice",
  "Maven's Chisel of Divination",
  "Maven's Chisel of Procurement",
  "Maven's Chisel of Proliferation",
  "Maven's Chisel of Scarabs",
])

const router = useRouter()

const formSchema = toTypedSchema(
  z
    .object({
      //session info
      sessionName: z.string().min(2).max(50),
      sessionDescription: z.string().min(2).max(250),
      sessionNotes: z.string().max(250).optional(),
      //map info
      isRandomMap: z.boolean(),
      mapName: z.string().min(2).max(50),
      isOriginator: z.boolean(),
      isSelfFarmed: z.boolean(),
      mapCost: z.number().optional(),
      numberOfMaps: z.number().min(1).max(1000),
      //chisels info
      isUsingChisels: z.boolean(),
      chiselName: ChiselNames.optional(),
      chiselPrice: z.number().optional(),
      //scarabs info
      isUsingScarabs: z.boolean(),
      scarabs: z.array(
        z.object({
          name: z.string().max(50).optional(),
          quantity: z.number().max(5).optional(),
          price: z.number().optional(),
        }),
      ),
      //map device craft info
      isUsingMapCraft: z.boolean(),
      mapCraftName: z.string().max(50).optional(),
      mapCraftPrice: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isSelfFarmed) {
        if (data.mapCost === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map cost is required',
            path: ['mapCost'],
          })
        }
      }
      if (data.isUsingChisels) {
        if (data.chiselPrice === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Chisel price is required',
            path: ['chiselPrice'],
          })
        }
      }
      if (data.isUsingScarabs) {
        const totalQuantity = data.scarabs.reduce((sum, s) => sum + (s.quantity ?? 0), 0)
        const lastScarabIndex = data.scarabs.length - 1
        if (totalQuantity > 5) {
          ctx.addIssue({
            code: 'custom',
            message: 'You can’t use more than 5 scarabs total (map device limit)',
            path: ['scarabs[' + lastScarabIndex + '].quantity'],
          })
        }
        data.scarabs.forEach((scarab, index) => {
          if (scarab.name === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Name is required when using scarabs',
              path: ['scarabs[' + index + '].name'],
            })
          }
          if (scarab.quantity === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Quantity is required when using scarabs',
              path: ['scarabs[' + index + '].quantity'],
            })
          }
          if (scarab.price === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Price must be greater than 0',
              path: ['scarabs[' + index + '].price'],
            })
          }
        })
      }
      if (data.isUsingMapCraft) {
        if (data.mapCraftName === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map craft name is required',
            path: ['mapCraftName'],
          })
        }
        if (data.mapCraftPrice === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map craft price is required',
            path: ['mapCraftPrice'],
          })
        }
      }
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

function calculateTotalCost(values: typeof form.values) {
  let total = 0
  const NO_OF_CHISELS = 4
  const numberOfMaps = values.numberOfMaps ?? 0

  // Map cost
  if (!values.isSelfFarmed && values.mapCost) {
    total += values.mapCost * numberOfMaps
  }

  // Chisel cost
  if (values.isUsingChisels && values.chiselPrice) {
    total += values.chiselPrice * NO_OF_CHISELS * numberOfMaps
  }

  // Scarabs
  if (values.isUsingScarabs && values.scarabs?.length) {
    for (const scarab of values.scarabs) {
      total += scarab.price * scarab.quantity * numberOfMaps
    }
  }

  // Map craft
  if (values.isUsingMapCraft && values.mapCraftPrice) {
    total += values.mapCraftPrice * numberOfMaps
  }

  return total
}

const { isSignedIn, user, isLoaded } = useUser()

const {
  isLoading,
  error,
  mutate: addSession,
} = useConvexMutation(api['farmingSessions'].addNewSession, {
  onSuccess: (data) => {
    console.log('Session added successfully!', data)
    router.push(`/sessions/${data}`)
  },
  onError: (error) => {
    console.error('Error adding session:', error)
  },
})
const onSubmit = form.handleSubmit((values) => {
  const totalQuantity = values.scarabs.reduce((sum, s) => sum + s.quantity, 0)
  if (totalQuantity > 5) {
    alert('Total scarab quantity cannot exceed 5.')
    return
  }
  console.log('Form submitted!', values)
  if (!isSignedIn) {
    alert('Please sign in to create a session.')
    return
  }
  if (!isLoaded) {
    alert('Please wait for the user data to load.')
    return
  }
  if (!user) {
    alert('User data not available.')
    return
  }
  if (!user.value?.id) {
    alert('User ID not available.')
    return
  }
  addSession({
    userId: user.value.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    mapName: values.mapName,
    isRandomMap: values.isRandomMap,
    isOriginator: values.isOriginator,
    isSelfFarmed: values.isSelfFarmed,
    mapCost: values.mapCost,
    numberOfMaps: values.numberOfMaps,
    isUsingChisels: values.isUsingChisels,
    chiselName: values.chiselName,
    chiselPrice: values.chiselPrice,
    isUsingScarabs: values.isUsingScarabs,
    scarabs: values.scarabs,
    isUsingMapCraft: values.isUsingMapCraft,
    mapCraftName: values.mapCraftName,
    mapCraftPrice: values.mapCraftPrice,
    isConcluded: false,
    sessionDescription: values.sessionDescription,
    sessionName: values.sessionName,
    sessionNotes: values.sessionNotes ?? '',
    totalCost: calculateTotalCost(values),
  })
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
  <div class="grid gap-6 grid-cols-1 lg:grid-cols-3">
    <form @submit="onSubmit" class="lg:col-span-2">
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
                <FormLabel>Chisel Type</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="!form.values.isUsingChisels">
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a chisel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Cartographer's Chisel">
                          Cartographer's Chisel
                        </SelectItem>
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
                  <Input
                    type="number"
                    placeholder="10"
                    v-bind="componentField"
                    :disabled="!form.values.isUsingChisels"
                    step="0.01"
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
            <FormField v-slot="{ componentField }" name="mapCraftPrice">
              <FormItem>
                <FormLabel>Map Craft Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    step="1"
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
      <Button type="submit" class="ml-auto mr-6 block" v-if="isLoading" disabled
        >Submitting...</Button
      >
      <Button type="submit" class="ml-auto mr-6 block" v-else>Submit</Button>
    </form>
    <CostSummary :values="form.values" />
  </div>
</template>
