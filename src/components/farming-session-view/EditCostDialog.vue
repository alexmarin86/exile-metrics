<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import { toast } from 'vue-sonner'
import { ChiselNames } from '@/utils/farmingSessionSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FilePen } from 'lucide-vue-next'
import ChiselsCraftSection from '@/components/new-farming-session-view/form-sections/ChiselsCraftSection.vue'
import ScarabsSection from '@/components/new-farming-session-view/form-sections/ScarabsSection.vue'
import type { Doc } from '../../../convex/_generated/dataModel'
import type { GenericForm, FullFormData } from '@/types/FormTypes'
import { computed, ref, watch } from 'vue'

// Type for cost-specific form data that matches the schema
type CostFormData = {
  isUsingChisels?: boolean
  chiselName?: string
  chiselPrice?: number
  isUsingScarabs?: boolean
  scarabs?: Array<{
    name?: string
    quantity?: number
    price?: number
  }>
  isUsingMapCraft?: boolean
  mapCraftName?: string
  mapCraftPrice?: number
}

type FarmingSession = Doc<'FarmingSession'>

interface Props {
  session: FarmingSession
}

const props = defineProps<Props>()

const isDialogOpen = ref(false)

watch(isDialogOpen, (newOpen) => {
  if (newOpen) {
    saveToCache(getInitialValues())
  }
})

const updateSessionCostMutation = useConvexMutation(api.farmingSessions.updateSessionCost)

const cacheKey = `edit-cost-dialog-${props.session._id}`

const saveToCache = (values: CostFormData) => {
  localStorage.setItem(cacheKey, JSON.stringify(values))
}

const loadFromCache = (): CostFormData | null => {
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      return null
    }
  }
  return null
}

const clearCache = () => {
  localStorage.removeItem(cacheKey)
}

const getInitialValues = (): CostFormData => {
  const cached = loadFromCache()
  if (cached) {
    return cached
  }

  const sessionValues = {
    isUsingChisels: props.session.isUsingChisels,
    chiselName: props.session.chiselName,
    chiselPrice: props.session.chiselPrice,
    isUsingScarabs: props.session.isUsingScarabs,
    scarabs:
      props.session.scarabs && props.session.scarabs.length > 0
        ? [...props.session.scarabs]
        : [{ name: '', quantity: 1, price: 0 }],
    isUsingMapCraft: props.session.isUsingMapCraft,
    mapCraftName: props.session.mapCraftName,
    mapCraftPrice: props.session.mapCraftPrice,
  }

  saveToCache(sessionValues)
  return sessionValues
}

const editCostSchema = toTypedSchema(
  z
    .object({
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
            message: "You can't use more than 5 scarabs total (map device limit)",
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

const initialValues = getInitialValues()

const form = useForm({
  validationSchema: editCostSchema,
  initialValues,
})

const resetFormValues = () => {
  const values = getInitialValues()
  form.setValues(values)
}

watch(isDialogOpen, (newValue) => {
  if (newValue) {
    resetFormValues()
  }
})

// Create wrapper object that matches the expected interface
const fullFormWrapper = computed(
  (): GenericForm<FullFormData> => ({
    values: {
      // Session info (dummy values - not used)
      sessionName: '',
      sessionDescription: '',
      sessionNotes: '',
      // Map info (dummy values - not used)
      isRandomMap: false,
      mapName: '',
      isOriginator: false,
      isSelfFarmed: false,
      mapCost: 0,
      numberOfMaps: 1,
      // Actual cost-related fields
      isUsingChisels: form.values.isUsingChisels || false,
      chiselName: form.values.chiselName,
      chiselPrice: form.values.chiselPrice,
      isUsingScarabs: form.values.isUsingScarabs || false,
      scarabs: form.values.scarabs || [],
      isUsingMapCraft: form.values.isUsingMapCraft || false,
      mapCraftName: form.values.mapCraftName,
      mapCraftPrice: form.values.mapCraftPrice,
    },
    setFieldValue: (field: string, value: unknown) => {
      // Type assertion needed for dynamic field paths
      const setField = form.setFieldValue as (field: string, value: unknown) => void
      setField(field, value)
      saveToCache(form.values as CostFormData)
    },
  }),
)

const addScarabRow = () => {
  const current = form.values.scarabs ?? []
  form.setFieldValue('scarabs', [...current, { name: '', quantity: 1, price: 0 }])
}

const removeScarabRow = (index: number) => {
  const current = form.values.scarabs ?? []
  const updated = [...current]
  updated.splice(index, 1)
  form.setFieldValue('scarabs', updated)
}

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const validScarabs = values.scarabs
      .filter((s) => s.name && s.quantity !== undefined && s.price !== undefined)
      .map((s) => ({
        name: s.name!,
        quantity: s.quantity!,
        price: s.price!,
      }))

    await updateSessionCostMutation.mutate({
      sessionId: props.session._id,
      userId: props.session.userId,
      isUsingChisels: values.isUsingChisels,
      chiselName: values.chiselName,
      chiselPrice: values.chiselPrice,
      isUsingScarabs: values.isUsingScarabs,
      scarabs: validScarabs.length > 0 ? validScarabs : undefined,
      isUsingMapCraft: values.isUsingMapCraft,
      mapCraftName: values.mapCraftName,
      mapCraftPrice: values.mapCraftPrice,
    })

    clearCache()

    toast.success('Cost settings updated successfully!')
    isDialogOpen.value = false
  } catch (error) {
    console.error('Error updating cost settings:', error)
    toast.error('Failed to update cost settings. Please try again.')
  }
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button variant="secondary" size="sm" class="h-8 px-2">
        <FilePen class="h-4 w-4 mr-1" />
        Edit
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[700px] max-h-[80vh] overflow-y-auto text-foreground">
      <DialogHeader>
        <DialogTitle class="text-foreground">Edit Cost Settings</DialogTitle>
        <DialogDescription>
          Update the chisels, scarabs, and map craft settings that affect the cost calculation.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-6">
        <ChiselsCraftSection :form="fullFormWrapper" />
        <ScarabsSection
          :form="fullFormWrapper"
          @add-scarab-row="addScarabRow"
          @remove-scarab-row="removeScarabRow"
        />

        <DialogFooter>
          <DialogTrigger as-child>
            <Button
              type="button"
              variant="outline"
              class="bg-background text-foreground hover:bg-background/80 hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <Button type="submit"> Save Changes </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
