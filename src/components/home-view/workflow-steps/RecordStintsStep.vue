<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Timer,
  Play,
  Pause,
  Square,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  BarChart3,
  ArrowRight,
} from 'lucide-vue-next'
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <!-- Left Side: Mock Session Interface -->
    <div class="relative order-2 lg:order-1">
      <!-- Decorative Elements -->
      <div class="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

      <div class="space-y-4 relative">
        <!-- Active Session Card -->
        <Card
          class="bg-gradient-to-r from-primary/5 via-background to-accent/5 border border-primary/20 shadow-lg"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center space-x-2 text-lg">
                <Timer class="w-5 h-5 text-primary" />
                <span>Legion Farming - Cemetery</span>
              </CardTitle>
              <Badge variant="secondary" class="text-xs animate-pulse">Active</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Current Stint -->
            <!-- Current Stint -->
            <div class="p-4 bg-card/60 rounded-lg border border-border/50">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-foreground flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-accent" />
                  <span>Current Stint</span>
                </h4>
                <span class="text-2xl font-bold text-primary font-mono">01:23:45</span>
              </div>

              <div class="text-center text-sm text-muted-foreground mb-4">
                <div class="text-xs">Started at</div>
                <div class="font-medium">14:32:18</div>
              </div>

              <div class="flex justify-center space-x-2 mt-4">
                <button
                  class="bg-accent hover:bg-accent/90 text-accent-foreground p-2 rounded-lg transition-colors"
                >
                  <Pause class="w-4 h-4" />
                </button>
                <button
                  class="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg transition-colors"
                >
                  <Square class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Previous Stints -->
            <div class="space-y-2">
              <h4 class="font-medium text-foreground text-sm">Previous Stints</h4>

              <div class="space-y-2 max-h-32 overflow-y-auto">
                <div
                  class="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30"
                >
                  <div class="flex items-center space-x-3">
                    <CheckCircle2 class="w-4 h-4 text-primary" />
                    <div>
                      <div class="font-medium text-sm">Stint 1</div>
                      <div class="text-xs text-muted-foreground">12:15 - 14:30</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-sm text-primary">2h 15m</div>
                    <div class="text-xs text-muted-foreground">Aug 7th</div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30"
                >
                  <div class="flex items-center space-x-3">
                    <CheckCircle2 class="w-4 h-4 text-primary" />
                    <div>
                      <div class="font-medium text-sm">Stint 2</div>
                      <div class="text-xs text-muted-foreground">09:45 - 11:37</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-sm text-primary">1h 52m</div>
                    <div class="text-xs text-muted-foreground">Aug 6th</div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30"
                >
                  <div class="flex items-center space-x-3">
                    <CheckCircle2 class="w-4 h-4 text-primary" />
                    <div>
                      <div class="font-medium text-sm">Stint 3</div>
                      <div class="text-xs text-muted-foreground">16:20 - 17:45</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-sm text-primary">1h 25m</div>
                    <div class="text-xs text-muted-foreground">Aug 5th</div>
                  </div>
                </div>
              </div>

              <!-- Total Time Summary -->
              <div class="pt-2 border-t border-border/30 mt-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-muted-foreground">Total farming time:</span>
                  <span class="font-mono font-semibold text-foreground">5h 32m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Notes Section -->
        <Card class="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardContent class="p-4">
            <div class="flex items-center space-x-2 mb-3">
              <FileText class="w-4 h-4 text-accent" />
              <span class="font-medium text-sm">Session Notes</span>
            </div>
            <div class="bg-background/50 p-3 rounded-lg border border-border/30">
              <p class="text-sm text-muted-foreground italic">
                "Great Legion spawns in Cemetery. Finding consistent Maraketh generals. Currency
                drops feel above average this league..."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Right Side: Description -->
    <div class="space-y-6 order-1 lg:order-2">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <Timer class="w-8 h-8 text-accent" />
          <h3 class="text-3xl font-bold text-foreground">Record Your Progress</h3>
        </div>

        <p class="text-lg text-muted-foreground leading-relaxed">
          Track your mapping sessions in real-time with our built-in stint timer. Record when you
          start and stop farming, take notes on your experience, and build detailed time logs for
          later analysis when you complete your session.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <Play class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Live Timer</h4>
            <p class="text-sm text-muted-foreground">
              Start, pause, and stop your farming sessions
            </p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
        >
          <Target class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Time Tracking</h4>
            <p class="text-sm text-muted-foreground">Precise start and end time logging</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10"
        >
          <FileText class="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Smart Notes</h4>
            <p class="text-sm text-muted-foreground">Capture insights and observations</p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <BarChart3 class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Session Insights</h4>
            <p class="text-sm text-muted-foreground">
              Analyze farming patterns and time efficiency
            </p>
          </div>
        </div>
      </div>

      <!-- Key Benefits -->
      <div
        class="p-6 bg-gradient-to-r from-accent/10 via-background to-primary/10 rounded-xl border border-border/30"
      >
        <div class="flex items-center space-x-2 mb-4">
          <TrendingUp class="w-5 h-5 text-primary" />
          <h4 class="font-semibold text-foreground">Why Track Your Stints?</h4>
        </div>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-accent flex-shrink-0" />
            <span>Track when you're most focused and efficient</span>
          </li>
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-accent flex-shrink-0" />
            <span>Identify optimal farming session lengths</span>
          </li>
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-accent flex-shrink-0" />
            <span>Build a detailed log for session completion</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
