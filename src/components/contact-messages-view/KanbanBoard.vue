<script setup lang="ts">
import { computed } from 'vue'
import { Code, ExternalLink } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Id } from '../../../convex/_generated/dataModel'

type MessageStatus =
  | 'pending'
  | 'inDevelopmentQueue'
  | 'starred'
  | 'highPriority'
  | 'lowPriority'
  | 'addressed'

interface ContactMessage {
  _id: Id<'ContactMessage'>
  userId: string
  subject: string
  message: string
  status?: MessageStatus
  _creationTime: number
  createdAt?: number
  updatedAt?: number
}

const props = defineProps<{
  messages: ContactMessage[]
}>()

const inDevelopmentMessages = computed(() =>
  props.messages.filter((msg) => msg.status === 'inDevelopmentQueue'),
)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const truncateMessage = (message: string, maxLength: number = 120) => {
  if (message.length <= maxLength) return message
  return message.slice(0, maxLength) + '...'
}

const createGithubIssue = (message: ContactMessage) => {
  const title = encodeURIComponent(`Feature Request: ${message.subject}`)
  const body = encodeURIComponent(
    `**Original Message:**\n${message.message}\n\n**User ID:** ${message.userId}\n**Created:** ${formatDate(message._creationTime)}\n\n**Status:** In Development Queue`,
  )
  const githubRepoUrl = import.meta.env.VITE_GITHUB_URL ?? ''
  const url = `${githubRepoUrl}/issues/new?title=${title}&body=${body}&labels=enhancement,from-contact-form`
  window.open(url, '_blank')
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <Code class="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <h2 class="text-xl font-semibold">Development Queue</h2>
      <Badge variant="secondary" class="ml-2">
        {{ inDevelopmentMessages.length }}
      </Badge>
    </div>

    <div
      v-if="inDevelopmentMessages.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <Code class="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>No messages in development queue</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card
        v-for="message in inDevelopmentMessages"
        :key="message._id"
        class="cursor-pointer hover:shadow-md transition-shadow duration-200 group"
        @click="createGithubIssue(message)"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <CardTitle class="text-sm font-medium leading-tight">
              {{ message.subject }}
            </CardTitle>
            <ExternalLink
              class="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2"
            />
          </div>
          <CardDescription class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(message._creationTime) }}
          </CardDescription>
        </CardHeader>

        <CardContent class="pt-0">
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ truncateMessage(message.message) }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div v-if="inDevelopmentMessages.length > 0" class="mt-4 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Click on any card to create a GitHub issue
      </p>
    </div>
  </div>
</template>
