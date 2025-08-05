<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Doc } from '../../convex/_generated/dataModel'
import { linkifyAndSanitize } from '@/utils/textProcessing'
import CostSummary from './CostSummary.vue'

type FarmingSession = Doc<'FarmingSession'>

const props = defineProps<{
  session: FarmingSession
}>()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <Card class="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <span>{{ props.session.sessionName }}</span>
          <Badge :variant="props.session.isConcluded ? 'secondary' : 'default'">
            {{ props.session.isConcluded ? 'Concluded' : 'Active' }}
          </Badge>
        </CardTitle>
        <p
          class="text-sm text-muted-foreground whitespace-pre-line"
          v-html="linkifyAndSanitize(session.sessionDescription)"
        ></p>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <div>
          <span class="font-semibold">Map:</span>
          {{ props.session.isRandomMap ? 'Random' : props.session.mapName }}
        </div>
        <div v-if="props.session.isUsingMapCraft">
          <span class="font-semibold">Map Craft:</span> {{ props.session.mapCraftName }}
        </div>
        <div v-if="props.session.isUsingChisels">
          <span class="font-semibold">Chisels:</span> {{ props.session.chiselName }}
        </div>
        <div v-if="props.session.isUsingScarabs">
          <span class="font-semibold">Scarabs:</span>
          <ul class="list-disc list-inside">
            <li v-for="s in props.session.scarabs" :key="s.name">
              {{ s.name }} × {{ s.quantity }}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <CostSummary
      :values="{
        numberOfMaps: props.session.numberOfMaps,
        mapCost: props.session.mapCost,
        isUsingChisels: props.session.isUsingChisels,
        chiselPrice: props.session.chiselPrice,
        isUsingScarabs: props.session.isUsingScarabs,
        scarabs: props.session.scarabs,
        isUsingMapCraft: props.session.isUsingMapCraft,
        mapCraftPrice: props.session.mapCraftPrice,
      }"
      :totalCost="props.session.totalCost"
    />
  </div>
</template>
