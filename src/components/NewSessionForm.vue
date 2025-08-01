<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/vue'
import { useFarmingSessionForm } from '@/composables/useFarmingSessionForm'
import { calculateTotalCost } from '@/utils/costCalculations'
import CostSummary from '@/components/CostSummary.vue'
import SessionInfoFormSection from '@/components/form-sections/SessionInfoFormSection.vue'
import MapInfoSection from '@/components/form-sections/MapInfoSection.vue'
import ChiselsCraftSection from '@/components/form-sections/ChiselsCraftSection.vue'
import ScarabsSection from '@/components/form-sections/ScarabsSection.vue'

const router = useRouter()
const { isSignedIn, user, isLoaded } = useUser()
const { form, addScarabRow, removeScarabRow } = useFarmingSessionForm()

const { isLoading, mutate: addSession } = useConvexMutation(api['farmingSessions'].addNewSession, {
  onSuccess: (data) => {
    console.log('Session added successfully!', data)
    router.push(`/sessions/${data}`)
  },
  onError: (error) => {
    console.error('Error adding session:', error)
  },
})

const onSubmit = form.handleSubmit((values) => {
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
  const scarabArray = values.isUsingScarabs
    ? values.scarabs.map((scarab) => ({
        name: scarab.name ?? '',
        quantity: scarab.quantity ?? 1,
        price: scarab.price ?? 0,
      }))
    : []
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
    scarabs: scarabArray,
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
</script>

<template>
  <div class="grid gap-6 grid-cols-1 lg:grid-cols-3">
    <form @submit="onSubmit" class="lg:col-span-2">
      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:gap-12 mb-12">
        <SessionInfoFormSection :form="form" />
        <MapInfoSection :form="form" />
        <ChiselsCraftSection :form="form" />
        <ScarabsSection
          :form="form"
          @add-scarab-row="addScarabRow"
          @remove-scarab-row="removeScarabRow"
        />
      </div>
      <Button type="submit" class="ml-auto mr-6 block" v-if="isLoading" disabled>
        Submitting...
      </Button>
      <Button type="submit" class="ml-auto mr-6 block" v-else> Submit </Button>
      <small class="text-card-foreground mt-4 ml-auto block w-fit">
        You will be redirected to the session page after submission.
      </small>
    </form>
    <CostSummary
      :values="
        {
          ...form.values,
          numberOfMaps: form.values.numberOfMaps ?? 1,
        } as any
      "
    />
  </div>
</template>
