<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Doc } from '../../convex/_generated/dataModel'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Overview -->
    <Card class="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <span>{{ props.session.sessionName }}</span>
          <Badge :variant="props.session.isConcluded ? 'secondary' : 'default'">
            {{ props.session.isConcluded ? 'Concluded' : 'Active' }}
          </Badge>
        </CardTitle>
        <p class="text-sm text-muted-foreground">{{ props.session.sessionDescription }}</p>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="text-sm">
          <span class="font-semibold">Created:</span>
          {{ new Date(props.session.createdAt).toLocaleString() }}
        </div>
        <div class="text-sm">
          <span class="font-semibold">Updated:</span>
          {{ new Date(props.session.updatedAt).toLocaleString() }}
        </div>
      </CardContent>
    </Card>

    <!-- Map Setup -->
    <Card class="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Map Setup</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <div>
          <span class="font-semibold">Map:</span>
          {{ props.session.isRandomMap ? 'Random' : props.session.mapName }}
        </div>
        <div><span class="font-semibold">Maps Run:</span> {{ props.session.numberOfMaps }}</div>
        <div v-if="props.session.isUsingChisels">
          <span class="font-semibold">Chisels:</span>
          {{ props.session.chiselName }} ({{ props.session.chiselPrice }}c each × 4 per map)
        </div>
        <div v-if="props.session.isUsingMapCraft">
          <span class="font-semibold">Map Craft:</span>
          {{ props.session.mapCraftName }} ({{ props.session.mapCraftPrice }}c)
        </div>
      </CardContent>
    </Card>

    <!-- Costs -->
    <Card class="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Costs</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <div><span class="font-semibold">Map Base Cost:</span> {{ props.session.mapCost }}c</div>
        <div v-if="props.session.isUsingScarabs && props.session.scarabs.length">
          <span class="font-semibold">Scarabs Total:</span>
          {{ props.session.scarabs.reduce((sum, s) => sum + s.price * s.quantity, 0) }}c
        </div>
        <Separator />
        <div class="text-lg font-semibold flex justify-between">
          <span>Total Cost:</span>
          <span>{{ props.session.totalCost }}c</span>
        </div>
      </CardContent>
    </Card>

    <!-- Scarabs -->
    <Card v-if="props.session.isUsingScarabs" class="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Scarabs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2 text-sm">
          <li
            v-for="scarab in props.session.scarabs"
            :key="scarab.name"
            class="flex justify-between"
          >
            <span>{{ scarab.name }} × {{ scarab.quantity }}</span>
            <span>{{ (scarab.price * scarab.quantity).toFixed(1) }}c</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
