<script setup lang="ts">
import ContactForm from '@/components/contact/ContactForm.vue'
import { useUser } from '@clerk/vue'
import LoadState from '@/components/state-components/LoadState.vue'
import NotAuthedState from '@/components/state-components/NotAuthedState.vue'
const { isSignedIn, user, isLoaded } = useUser()
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <LoadState loadingMessage="Loading user data..." v-if="!isLoaded" />

    <NotAuthedState
      v-else-if="!isSignedIn || !user"
      unauthedHeading="Please Log In"
      unauthedMessage="You need to be logged in to send a message."
    />
    <div class="max-w-4xl mx-auto" v-else>
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about Exile Metrics? Need help with your farming sessions? Found a bug or
          have a feature request? We'd love to hear from you!
        </p>
      </div>

      <ContactForm :userId="user.id" />

      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div class="text-center p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Response Time</h3>
          <p class="text-muted-foreground">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>

        <div class="text-center p-6 bg-card rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">Rate Limits</h3>
          <p class="text-muted-foreground">
            To prevent spam, users can send up to 2 messages per day.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
