<script setup lang="ts">
import { Star, AlertTriangle, ArrowDown, Code, Check, Copy } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

// Props
defineProps<{
  messages: ContactMessage[]
}>()

// Emits
const emit = defineEmits<{
  updateStatus: [messageId: Id<'ContactMessage'>, status: MessageStatus]
}>()

// Methods
const toggleStatus = (messageId: Id<'ContactMessage'>, newStatus: MessageStatus) => {
  emit('updateStatus', messageId, newStatus)
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const getStatusLabel = (status: string): string => {
  const labels: Record<MessageStatus, string> = {
    pending: 'Pending',
    inDevelopmentQueue: 'In Development',
    starred: 'Starred',
    highPriority: 'High Priority',
    lowPriority: 'Low Priority',
    addressed: 'Addressed',
  }
  return labels[status as MessageStatus] || 'Unknown'
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<MessageStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    inDevelopmentQueue: 'secondary',
    starred: 'default',
    highPriority: 'destructive',
    lowPriority: 'secondary',
    addressed: 'default',
  }
  return variants[status as MessageStatus] || 'outline'
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}
</script>

<template>
  <div class="rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[150px]">User ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead class="w-[140px]">Status</TableHead>
            <TableHead class="w-[160px]">Created</TableHead>
            <TableHead class="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="message in messages" :key="message._id">
            <!-- User ID Cell with Copy Button -->
            <TableCell class="relative pr-12">
              <div class="truncate max-w-[10ch] text-sm">
                {{ message.userId }}
              </div>
              <button
                @click="copyToClipboard(message.userId)"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded z-10 transition-colors"
                :title="`Copy user ID: ${message.userId}`"
              >
                <Copy :size="14" />
              </button>
            </TableCell>

            <!-- Subject Cell -->
            <TableCell>
              <div class="max-w-xs truncate text-sm" :title="message.subject">
                {{ message.subject }}
              </div>
            </TableCell>

            <!-- Message Cell -->
            <TableCell>
              <div class="max-w-md truncate text-sm" :title="message.message">
                {{ message.message }}
              </div>
            </TableCell>

            <!-- Status Cell -->
            <TableCell>
              <Badge
                :variant="getStatusVariant(message.status || 'pending')"
                :class="[
                  'text-xs font-medium',
                  message.status === 'starred'
                    ? 'bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-500'
                    : '',
                ]"
              >
                {{ getStatusLabel(message.status || 'pending') }}
              </Badge>
            </TableCell>

            <!-- Created Cell -->
            <TableCell class="text-sm">
              {{ formatDate(message._creationTime) }}
            </TableCell>

            <!-- Actions Cell -->
            <TableCell>
              <div class="flex gap-1">
                <!-- Starred toggle -->
                <button
                  @click="
                    toggleStatus(message._id, message.status === 'starred' ? 'pending' : 'starred')
                  "
                  class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="message.status === 'starred' ? 'text-yellow-500' : 'text-gray-400'"
                  :title="message.status === 'starred' ? 'Remove from starred' : 'Add to starred'"
                >
                  <Star :size="16" :fill="message.status === 'starred' ? 'currentColor' : 'none'" />
                </button>

                <!-- High Priority -->
                <button
                  @click="
                    toggleStatus(
                      message._id,
                      message.status === 'highPriority' ? 'pending' : 'highPriority',
                    )
                  "
                  class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="message.status === 'highPriority' ? 'text-red-500' : 'text-gray-400'"
                  title="Toggle high priority"
                >
                  <AlertTriangle :size="16" />
                </button>

                <!-- Low Priority -->
                <button
                  @click="
                    toggleStatus(
                      message._id,
                      message.status === 'lowPriority' ? 'pending' : 'lowPriority',
                    )
                  "
                  class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="message.status === 'lowPriority' ? 'text-blue-500' : 'text-gray-400'"
                  title="Toggle low priority"
                >
                  <ArrowDown :size="16" />
                </button>

                <!-- Development Queue -->
                <button
                  @click="
                    toggleStatus(
                      message._id,
                      message.status === 'inDevelopmentQueue' ? 'pending' : 'inDevelopmentQueue',
                    )
                  "
                  class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="
                    message.status === 'inDevelopmentQueue' ? 'text-purple-500' : 'text-gray-400'
                  "
                  title="Toggle development queue"
                >
                  <Code :size="16" />
                </button>

                <!-- Addressed toggle -->
                <button
                  @click="
                    toggleStatus(
                      message._id,
                      message.status === 'addressed' ? 'pending' : 'addressed',
                    )
                  "
                  class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="message.status === 'addressed' ? 'text-green-500' : 'text-gray-400'"
                  title="Toggle addressed status"
                >
                  <Check :size="16" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
