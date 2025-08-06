<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
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
import SessionInfoFormSection from '@/components/new-farming-session-view/form-sections/SessionInfoFormSection.vue'
import MapInfoSection from '@/components/new-farming-session-view/form-sections/MapInfoSection.vue'
import type { Doc } from '../../../convex/_generated/dataModel'
import type { GenericForm, SessionInfoFormData, BasicMapInfoFormData } from '@/types/FormTypes'
import { computed } from 'vue'

type FarmingSession = Doc<'FarmingSession'>

interface Props {
  session: FarmingSession
}

const props = defineProps<Props>()

// Create the schema for editing session info and map info (excluding sessionNotes)
const editSessionSchema = toTypedSchema(
  z
    .object({
      //session info (excluding sessionNotes)
      sessionName: z.string().min(2).max(50),
      sessionDescription: z.string().min(2).max(250),
      //map info
      isRandomMap: z.boolean(),
      mapName: z.string().min(2).max(50),
      isOriginator: z.boolean(),
      isSelfFarmed: z.boolean(),
      mapCost: z.number().optional(),
      numberOfMaps: z.number().min(1).max(1000),
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
    }),
)

// Initialize form with current session values
const initialValues = {
  sessionName: props.session.sessionName,
  sessionDescription: props.session.sessionDescription,
  isRandomMap: props.session.isRandomMap,
  mapName: props.session.mapName,
  isOriginator: props.session.isOriginator,
  isSelfFarmed: props.session.isSelfFarmed,
  mapCost: props.session.mapCost,
  numberOfMaps: props.session.numberOfMaps,
}

const form = useForm({
  validationSchema: editSessionSchema,
  initialValues,
})

// Create wrapper objects that match the expected interfaces
const sessionFormWrapper = computed(
  (): GenericForm<SessionInfoFormData> => ({
    values: {
      sessionName: form.values.sessionName || '',
      sessionDescription: form.values.sessionDescription || '',
    },
    setFieldValue: (field: string, value: unknown) =>
      form.setFieldValue(
        field as keyof typeof form.values,
        value as string | number | boolean | undefined,
      ),
  }),
)

const mapFormWrapper = computed(
  (): GenericForm<BasicMapInfoFormData> => ({
    values: {
      isRandomMap: form.values.isRandomMap || false,
      mapName: form.values.mapName || '',
      isOriginator: form.values.isOriginator || false,
      isSelfFarmed: form.values.isSelfFarmed || false,
      mapCost: form.values.mapCost,
      numberOfMaps: form.values.numberOfMaps || 1,
    },
    setFieldValue: (field: string, value: unknown) =>
      form.setFieldValue(
        field as keyof typeof form.values,
        value as string | number | boolean | undefined,
      ),
  }),
)

const onSubmit = form.handleSubmit(async (values) => {
  try {
    // TODO: Implement DB persistence later
    console.log('Form values:', values)
  } catch (error) {
    console.error('Error updating session:', error)
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" size="sm" class="h-8 px-2">
        <FilePen class="h-4 w-4 mr-1" />
        Edit
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] max-h-[80vh] overflow-y-auto text-foreground">
      <DialogHeader>
        <DialogTitle class="text-foreground">Edit Session Info</DialogTitle>
        <DialogDescription>
          Update the session information and map configuration for "{{ session.sessionName }}".
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-6">
        <SessionInfoFormSection :form="sessionFormWrapper" :is-editing="true" />
        <MapInfoSection :form="mapFormWrapper" />

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
