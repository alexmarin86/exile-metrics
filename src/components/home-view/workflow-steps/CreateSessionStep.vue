<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, MapPin, FileText, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <!-- Left Side: Description -->
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <PlusCircle class="w-8 h-8 text-primary" />
          <h3 class="text-3xl font-bold text-foreground">Create Your Session</h3>
        </div>

        <p class="text-lg text-muted-foreground leading-relaxed">
          Set up your farming session in seconds with our intuitive form. Configure your map
          selection, investment costs, and strategy details to get accurate profit tracking from the
          start.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          class="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
        >
          <CheckCircle2 class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Quick Setup</h4>
            <p class="text-sm text-muted-foreground">Configure your session in under 30 seconds</p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <CheckCircle2 class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Cost Tracking</h4>
            <p class="text-sm text-muted-foreground">Automatic investment calculations</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10"
        >
          <CheckCircle2 class="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Flexible Options</h4>
            <p class="text-sm text-muted-foreground">Supports any mapping strategy</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
        >
          <CheckCircle2 class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Smart Defaults</h4>
            <p class="text-sm text-muted-foreground">Pre-filled common values to save time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Mock Form -->
    <div class="relative">
      <!-- Decorative Elements -->
      <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>

      <Card class="relative bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center space-x-2 text-lg">
              <Sparkles class="w-5 h-5 text-primary" />
              <span>New Farming Session</span>
            </CardTitle>
            <Badge variant="secondary" class="text-xs">Step 1</Badge>
          </div>
        </CardHeader>

        <CardContent class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Session Info -->
          <div class="space-y-4 flex flex-col">
            <div class="flex items-center space-x-2 text-sm font-medium text-foreground">
              <FileText class="w-4 h-4 text-primary" />
              <span>Session Details</span>
            </div>

            <div class="space-y-3 flex flex-col grow">
              <div class="space-y-2">
                <Label htmlFor="sessionName" class="text-xs text-muted-foreground"
                  >Session Name</Label
                >
                <Input
                  id="sessionName"
                  value="Legion Farming - Cemetery"
                  class="bg-background/50 border-border/50 text-sm cursor-default pointer-events-none"
                  readonly
                  disabled
                />
              </div>

              <div class="space-y-2 flex flex-col grow">
                <Label htmlFor="description" class="text-xs text-muted-foreground"
                  >Description</Label
                >
                <Textarea
                  id="description"
                  value="Testing Legion monoliths in Cemetery maps with full investment"
                  class="bg-background/50 border-border/50 text-sm resize-none h-16 grow cursor-default pointer-events-none"
                  readonly
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Map Configuration -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2 text-sm font-medium text-foreground">
              <MapPin class="w-4 h-4 text-accent" />
              <span>Map Configuration</span>
            </div>

            <div class="space-y-3">
              <div class="space-y-2">
                <Label class="text-xs text-muted-foreground">Map Type</Label>
                <Input
                  placeholder="Cemetery..."
                  class="bg-background/50 border-border/50 text-sm h-8 cursor-default pointer-events-none"
                  readonly
                  disabled
                />
              </div>

              <div class="space-y-2">
                <Label class="text-xs text-muted-foreground">Map Count</Label>
                <Input
                  value="100"
                  class="bg-background/50 border-border/50 text-sm h-8 cursor-default pointer-events-none"
                  readonly
                  disabled
                />
              </div>
            </div>
            <RouterLink
              to="/sessions/new"
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <span>New Session</span>
              <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
