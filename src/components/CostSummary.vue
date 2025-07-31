<script setup lang="ts">
import { computed, watchEffect } from 'vue'

interface Scarab {
  name: string
  quantity: number
  price: number
}

const props = defineProps<{
  values: {
    numberOfMaps: number
    mapCost?: number
    isUsingChisels: boolean
    chiselPrice?: number
    isUsingScarabs: boolean
    scarabs?: Scarab[]
    isUsingMapCraft: boolean
    mapCraftPrice?: number
  }
  totalCost?: number
}>()

// Compute breakdown
const breakdown = computed(() => {
  const items: { label: string; cost: number }[] = []
  const v = props.values
  const numberOfMaps = v.numberOfMaps ?? 0

  // Map cost
  if (v.mapCost) {
    items.push({
      label: `Maps (${numberOfMaps} × ${v.mapCost})`,
      cost: v.mapCost * numberOfMaps,
    })
  }

  // Chisels
  if (v.isUsingChisels && v.chiselPrice) {
    const cost = v.chiselPrice * 4 * numberOfMaps
    items.push({
      label: `Chisels (4 × ${v.chiselPrice} × ${numberOfMaps})`,
      cost,
    })
  }

  // Scarabs
  if (v.isUsingScarabs && v.scarabs?.length) {
    v.scarabs.forEach((s: Scarab) => {
      if (s.price && s.quantity) {
        const cost = s.price * s.quantity * numberOfMaps
        items.push({
          label: `Scarab ${s.name} (${s.quantity} × ${s.price} × ${numberOfMaps})`,
          cost,
        })
      }
    })
  }

  // Map craft
  if (v.isUsingMapCraft && v.mapCraftPrice) {
    items.push({
      label: `Map craft (${numberOfMaps} × ${v.mapCraftPrice})`,
      cost: v.mapCraftPrice * numberOfMaps,
    })
  }

  return items
})

const total = computed(() => breakdown.value.reduce((sum, i) => sum + i.cost, 0))

watchEffect(() => {
  if (props.totalCost !== undefined && props.totalCost !== total.value) {
    console.warn(
      `[CostSummary] Stored total (${props.totalCost}) ` +
        `does not match computed total (${total.value}).`,
    )
    // TODO: later replace with external logger
  }
})
</script>

<template>
  <div class="rounded-xl border p-4 space-y-3 bg-card text-card-foreground">
    <h3 class="text-lg font-semibold">Cost Summary (in Chaos Orbs)</h3>

    <ul class="space-y-1">
      <li v-for="(item, idx) in breakdown" :key="idx" class="flex justify-between">
        <span>{{ item.label }}</span>
        <span>{{ item.cost.toFixed(2) }}</span>
      </li>
    </ul>

    <div class="border-t pt-2 flex justify-between font-bold">
      <span>Total</span>
      <span>{{ total.toFixed(2) }}</span>
    </div>
  </div>
</template>
