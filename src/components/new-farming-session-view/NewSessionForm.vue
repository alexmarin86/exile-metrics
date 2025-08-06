<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/vue'
import { useFarmingSessionForm } from '@/composables/useFarmingSessionForm'
import { calculateTotalCost } from '@/utils/costCalculations'
import CostSummary from '@/components/farming-session-view/CostSummary.vue'
import SessionInfoFormSection from '@/components/new-farming-session-view/form-sections/SessionInfoFormSection.vue'
import MapInfoSection from '@/components/new-farming-session-view/form-sections/MapInfoSection.vue'
import ChiselsCraftSection from '@/components/new-farming-session-view/form-sections/ChiselsCraftSection.vue'
import ScarabsSection from '@/components/new-farming-session-view/form-sections/ScarabsSection.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const { isSignedIn, user, isLoaded } = useUser()
const { form, addScarabRow, removeScarabRow, sessionFormAdapter, mapFormAdapter, fullFormAdapter } =
  useFarmingSessionForm()

const { isLoading, mutate: addSession } = useConvexMutation(api['farmingSessions'].addNewSession, {
  onSuccess: (data) => {
    router.push(`/sessions/${data}`)
  },
  onError: (error) => {
    console.error('Error adding session:', error)
    toast('Failed to create session', {
      description: 'Please try again later.',
      class: 'bg-red-500 text-white',
      descriptionClass: 'text-white',
    })
  },
})

const onSubmit = form.handleSubmit((values) => {
  if (!isSignedIn) {
    toast('You must be signed in to create a session.', {
      description: 'Please log in to continue.',
    })
    return
  }
  if (!isLoaded) {
    toast('Please wait for the user data to load.', {
      description: 'Please try again after a few seconds.',
    })
    return
  }
  if (!user) {
    toast('User data not available.', {
      description: 'Please try again later.',
    })
    return
  }
  if (!user.value?.id) {
    toast('Something went wrong when trying to authenticate you.', {
      description: 'Please ensure you are logged in.',
    })
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
        <SessionInfoFormSection :form="sessionFormAdapter" />
        <MapInfoSection :form="mapFormAdapter" />
        <ChiselsCraftSection :form="fullFormAdapter" />
        <ScarabsSection
          :form="fullFormAdapter"
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
