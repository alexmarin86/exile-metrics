<script setup lang="ts">
defineProps<{
  sessions: {
    _id: string
    sessionName: string
    mapName: string
    sessionDescription: string
    numberOfMaps: number
  }[]
}>()
</script>

<template>
  <table class="w-full table-auto border-collapse text-sm">
    <thead class="text-left text-muted-foreground">
      <tr>
        <th class="p-2">Session Name</th>
        <th class="p-2">Map Name</th>
        <th class="p-2">Description</th>
        <th class="p-2"># Maps</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="session in sessions" :key="session._id" class="border-t">
        <td class="p-2 font-medium">{{ session.sessionName }}</td>
        <td class="p-2">{{ session.mapName }}</td>
        <td class="p-2 max-w-[300px] truncate">{{ session.sessionDescription }}</td>
        <td class="p-2">{{ session.numberOfMaps }}</td>
      </tr>
    </tbody>
  </table>
</template>
