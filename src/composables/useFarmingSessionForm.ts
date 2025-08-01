import { useForm } from 'vee-validate'
import { watch, ref, onMounted } from 'vue'
import { farmingSessionSchema, initialFormValues } from '@/utils/farmingSessionSchema'

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

  return {
    form,
    scarabs,
    addScarabRow,
    removeScarabRow,
  }
}

export type FarmingSessionForm = ReturnType<typeof useFarmingSessionForm>['form']
