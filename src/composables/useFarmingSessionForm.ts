import { useForm } from 'vee-validate'
import { watch, ref, onMounted, computed } from 'vue'
import { farmingSessionSchema, initialFormValues } from '@/utils/farmingSessionSchema'
import type {
  GenericForm,
  SessionInfoFormData,
  BasicMapInfoFormData,
  FullFormData,
} from '@/types/FormTypes'

export function useFarmingSessionForm() {
  const form = useForm({
    validationSchema: farmingSessionSchema,
    initialValues: initialFormValues,
  })

  const scarabs = ref(form.values.scarabs)

  // Form state change watchers
  watch(
    () => form.values.isRandomMap,
    (newVal) => {
      if (newVal === true) {
        form.setFieldValue('mapName', 'random')
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

  onMounted(() => {
    if (!form.values.scarabs || form.values.scarabs.length === 0) {
      form.setFieldValue('scarabs', [{ name: '', quantity: 1, price: 0 }])
    }
  })

  // Create adapters for the new generic interface
  const sessionFormAdapter = computed(
    (): GenericForm<SessionInfoFormData> => ({
      values: {
        sessionName: form.values.sessionName || '',
        sessionDescription: form.values.sessionDescription || '',
        sessionNotes: form.values.sessionNotes,
      },
      setFieldValue: (field: string, value: unknown) =>
        form.setFieldValue(
          field as keyof typeof form.values,
          value as string | number | boolean | undefined,
        ),
    }),
  )

  const mapFormAdapter = computed(
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

  const fullFormAdapter = computed(
    (): GenericForm<FullFormData> => ({
      values: {
        // Session info
        sessionName: form.values.sessionName || '',
        sessionDescription: form.values.sessionDescription || '',
        sessionNotes: form.values.sessionNotes,
        // Map info
        isRandomMap: form.values.isRandomMap || false,
        mapName: form.values.mapName || '',
        isOriginator: form.values.isOriginator || false,
        isSelfFarmed: form.values.isSelfFarmed || false,
        mapCost: form.values.mapCost,
        numberOfMaps: form.values.numberOfMaps || 1,
        isUsingChisels: form.values.isUsingChisels || false,
        chiselName: form.values.chiselName,
        chiselPrice: form.values.chiselPrice,
        isUsingScarabs: form.values.isUsingScarabs || false,
        scarabs: form.values.scarabs || [],
        isUsingMapCraft: form.values.isUsingMapCraft || false,
        mapCraftName: form.values.mapCraftName,
        mapCraftPrice: form.values.mapCraftPrice,
      },
      setFieldValue: (field: string, value: unknown) =>
        form.setFieldValue(
          field as keyof typeof form.values,
          value as string | number | boolean | undefined,
        ),
    }),
  )

  return {
    form,
    scarabs,
    addScarabRow,
    removeScarabRow,
    sessionFormAdapter,
    mapFormAdapter,
    fullFormAdapter,
  }
}

export type FarmingSessionForm = ReturnType<typeof useFarmingSessionForm>['form']
