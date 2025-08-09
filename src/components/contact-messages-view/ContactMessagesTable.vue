<script setup lang="ts">
import { ref } from 'vue'
import {
  Star,
  AlertTriangle,
  ArrowDown,
  Code,
  Check,
  Copy,
  EllipsisVertical,
} from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

// Reactive state for copy feedback
const copiedStates = ref<Record<string, boolean>>({})

// Methods
const toggleStatus = (messageId: Id<'ContactMessage'>, newStatus: MessageStatus) => {
  emit('updateStatus', messageId, newStatus)
}

const copyToClipboard = async (text: string, messageId: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show visual feedback using message ID as key
    copiedStates.value[messageId] = true
    // Hide feedback after 2 seconds
    setTimeout(() => {
      copiedStates.value[messageId] = false
    }, 2000)
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
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="message in messages" :key="message._id">
            <!-- User ID Cell with Copy Button -->
            <TableCell class="relative pr-12">
              <div class="truncate max-w-[10ch] text-sm">
                {{ message.userId }}
              </div>
              <Button
                @click="copyToClipboard(message.userId, message._id)"
                variant="ghost"
                size="icon"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 transition-all duration-200"
                :class="copiedStates[message._id] ? 'bg-green-900/30 hover:bg-green-900/40' : ''"
                :title="copiedStates[message._id] ? 'Copied!' : `Copy user ID: ${message.userId}`"
              >
                <Copy :size="14" />
              </Button>
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
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <!-- Starred toggle -->
                  <DropdownMenuItem
                    @click="
                      toggleStatus(
                        message._id,
                        message.status === 'starred' ? 'pending' : 'starred',
                      )
                    "
                    class="cursor-pointer hover:bg-foreground hover:text-accent-foreground dark:hover:bg-foreground/50"
                  >
                    <Star
                      :size="16"
                      :fill="message.status === 'starred' ? 'currentColor' : 'none'"
                      :class="message.status === 'starred' ? 'text-yellow-500' : 'text-gray-400'"
                      class="mr-2"
                    />
                    {{ message.status === 'starred' ? 'Remove from starred' : 'Add to starred' }}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <!-- High Priority -->
                  <DropdownMenuItem
                    @click="
                      toggleStatus(
                        message._id,
                        message.status === 'highPriority' ? 'pending' : 'highPriority',
                      )
                    "
                    class="cursor-pointer hover:bg-foreground hover:text-accent-foreground dark:hover:bg-foreground/50"
                  >
                    <AlertTriangle
                      :size="16"
                      :class="message.status === 'highPriority' ? 'text-red-500' : 'text-gray-400'"
                      class="mr-2"
                    />
                    {{
                      message.status === 'highPriority'
                        ? 'Remove high priority'
                        : 'Set high priority'
                    }}
                  </DropdownMenuItem>

                  <!-- Low Priority -->
                  <DropdownMenuItem
                    @click="
                      toggleStatus(
                        message._id,
                        message.status === 'lowPriority' ? 'pending' : 'lowPriority',
                      )
                    "
                    class="cursor-pointer hover:bg-foreground hover:text-accent-foreground dark:hover:bg-foreground/50"
                  >
                    <ArrowDown
                      :size="16"
                      :class="message.status === 'lowPriority' ? 'text-blue-500' : 'text-gray-400'"
                      class="mr-2"
                    />
                    {{
                      message.status === 'lowPriority' ? 'Remove low priority' : 'Set low priority'
                    }}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <!-- Development Queue -->
                  <DropdownMenuItem
                    @click="
                      toggleStatus(
                        message._id,
                        message.status === 'inDevelopmentQueue' ? 'pending' : 'inDevelopmentQueue',
                      )
                    "
                    class="cursor-pointer hover:bg-foreground hover:text-accent-foreground dark:hover:bg-foreground/50"
                  >
                    <Code
                      :size="16"
                      :class="
                        message.status === 'inDevelopmentQueue'
                          ? 'text-purple-500'
                          : 'text-gray-400'
                      "
                      class="mr-2"
                    />
                    {{
                      message.status === 'inDevelopmentQueue'
                        ? 'Remove from development queue'
                        : 'Add to development queue'
                    }}
                  </DropdownMenuItem>

                  <!-- Addressed toggle -->
                  <DropdownMenuItem
                    @click="
                      toggleStatus(
                        message._id,
                        message.status === 'addressed' ? 'pending' : 'addressed',
                      )
                    "
                    class="cursor-pointer hover:bg-foreground hover:text-accent-foreground dark:hover:bg-foreground/50"
                  >
                    <Check
                      :size="16"
                      :class="message.status === 'addressed' ? 'text-green-500' : 'text-gray-400'"
                      class="mr-2"
                    />
                    {{ message.status === 'addressed' ? 'Mark as pending' : 'Mark as addressed' }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
