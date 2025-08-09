<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConvexQuery } from '@convex-vue/core'
import { useUser } from '@clerk/vue'
import { Bell } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '../../convex/_generated/api'

const router = useRouter()
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

const userIdArgs = computed(() => ({
  userId: user.value?.id || '',
}))

const { data: lastAdminLoginTime } = useConvexQuery(api.userSettings.getLastAdminLogin, userIdArgs)

const notificationArgs = computed(() => ({
  lastAdminLoginTime: lastAdminLoginTime.value || undefined,
}))

const { data: newMessagesCount = 0 } = useConvexQuery(
  api.contactMessages.getNewContactMessagesCount,
  notificationArgs,
)

const handleClick = () => {
  if (hasPermission.value) {
    router.push('/admin/contact-messages')
  }
}
</script>

<template>
  <div v-if="hasPermission" class="relative">
    <Button variant="secondary" size="sm" @click="handleClick" class="relative">
      <Bell class="h-4 w-4" />
    </Button>
    <Badge
      v-if="newMessagesCount > 0"
      variant="destructive"
      class="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
    >
      {{ newMessagesCount > 99 ? '99+' : newMessagesCount }}
    </Badge>
  </div>
</template>
