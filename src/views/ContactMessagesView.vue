<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useConvexQuery, useConvexMutation } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/vue'
import LoadState from '@/components/state-components/LoadState.vue'
import EmptyState from '@/components/state-components/EmptyState.vue'
import ContactMessagesTable from '@/components/contact-messages-view/ContactMessagesTable.vue'
import KanbanBoard from '@/components/contact-messages-view/KanbanBoard.vue'
import type { Id } from '../../convex/_generated/dataModel'

type MessageStatus =
  | 'pending'
  | 'inDevelopmentQueue'
  | 'starred'
  | 'highPriority'
  | 'lowPriority'
  | 'addressed'

const { user, isLoaded } = useUser()

const hasPermission = computed(() => {
  if (!isLoaded.value || !user.value) return false
  const orgMembership = user.value.organizationMemberships[0]
  const hasAdminRole = orgMembership?.role === 'org:admin'
  const permissions = orgMembership?.permissions as string[] | undefined
  const hasContactPermission = permissions?.includes(
    'org:contact_message_access:hascontactmessagepermission',
  )

  return hasAdminRole && hasContactPermission
})

// Update last admin login time when viewing this page
const updateLastLogin = useConvexMutation(api.userSettings.updateLastAdminLogin)

const selectedStatus = ref<string>('')
const error = ref<string | null>(null)

const { data: allMessages, isLoading: allMessagesLoading } = useConvexQuery(
  api.contactMessages.getAllContactMessages,
  {},
)

const statusQueryArgs = computed(() => ({
  status: selectedStatus.value as MessageStatus,
}))

const shouldFetchByStatus = ref(false)

const { data: statusMessages, isLoading: statusMessagesLoading } = useConvexQuery(
  api.contactMessages.getContactMessagesByStatus,
  statusQueryArgs,
  {
    enabled: shouldFetchByStatus,
  },
)

const messages = computed(() => {
  if (!hasPermission.value) return []

  if (selectedStatus.value && statusMessages.value) {
    return statusMessages.value
  } else if (!selectedStatus.value && allMessages.value) {
    return allMessages.value
  }
  return []
})

const isLoading = computed(() => {
  if (!hasPermission.value) return false

  if (selectedStatus.value) {
    return statusMessagesLoading.value
  } else {
    return allMessagesLoading.value
  }
})

const updateMessageStatusMutation = useConvexMutation(api.contactMessages.updateMessageStatus)

const handleStatusUpdate = async (messageId: Id<'ContactMessage'>, newStatus: MessageStatus) => {
  try {
    await updateMessageStatusMutation.mutate({
      messageId,
      status: newStatus,
    })
  } catch (err) {
    console.error('Failed to update message status:', err)
  }
}

onMounted(async () => {
  if (!hasPermission.value && isLoaded.value) {
    error.value = 'You do not have permission to view contact messages'
  }

  // Update last admin login time when viewing messages
  if (hasPermission.value && user.value?.id) {
    await updateLastLogin.mutate({ userId: user.value.id })
  }
})

watch([hasPermission, isLoaded], ([hasPermissionValue, isLoadedValue]) => {
  if (isLoadedValue && !hasPermissionValue) {
    error.value = 'You do not have permission to view contact messages'
  } else if (hasPermissionValue) {
    error.value = null
  }
})

watch(
  [selectedStatus, hasPermission],
  ([statusValue, permissionValue]) => {
    shouldFetchByStatus.value = statusValue !== '' && permissionValue === true
  },
  { immediate: true },
)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Contact Messages</h1>
      <div class="flex gap-2">
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Messages</option>
          <option value="pending">Pending</option>
          <option value="inDevelopmentQueue">In Development Queue</option>
          <option value="starred">Starred</option>
          <option value="highPriority">High Priority</option>
          <option value="lowPriority">Low Priority</option>
          <option value="addressed">Addressed</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <LoadState v-if="isLoading" loadingMessage="Loading contact messages..." />

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 space-y-6">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Access Denied</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!messages || messages.length === 0"
      emptyHeading="No contact messages"
      emptyMessage="There are no contact messages to display."
    />

    <!-- Main Content -->
    <div v-else class="space-y-12">
      <!-- Messages Table -->
      <ContactMessagesTable :messages="messages" @update-status="handleStatusUpdate" />

      <!-- Kanban Board for In Development Messages -->
      <KanbanBoard :messages="messages" />
    </div>
  </div>
</template>
