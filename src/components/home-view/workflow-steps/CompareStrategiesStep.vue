<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart } from '@/components/ui/chart-bar'
import { BarChart3, TrendingUp, Target, Zap, ArrowRight, Trophy, Sparkles } from 'lucide-vue-next'
import { computed } from 'vue'

const mockChartData = [
  {
    name: 'Legion Cemetery',
    divPerHour: 8.4,
    divPerMap: 0.21,
  },
  {
    name: 'Breach Tower',
    divPerHour: 6.8,
    divPerMap: 0.18,
  },
  {
    name: 'Essence Strand',
    divPerHour: 7.2,
    divPerMap: 0.15,
  },
  {
    name: 'Harbinger Dunes',
    divPerHour: 5.9,
    divPerMap: 0.19,
  },
]

const topStrategy = computed(() => mockChartData[0])
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <!-- Left Side: Description -->
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <BarChart3 class="w-8 h-8 text-secondary-foreground" />
          <h3 class="text-3xl font-bold text-foreground">Optimize Your Strategy</h3>
        </div>

        <p class="text-lg text-muted-foreground leading-relaxed">
          Compare your farming strategies with detailed analytics. Discover which approaches yield
          the highest returns and refine your methods based on concrete data rather than guesswork.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          class="flex items-start space-x-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10"
        >
          <Trophy class="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Performance Ranking</h4>
            <p class="text-sm text-muted-foreground">See which strategies perform best</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
        >
          <TrendingUp class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Trend Analysis</h4>
            <p class="text-sm text-muted-foreground">Track improvements over time</p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <Target class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Efficiency Metrics</h4>
            <p class="text-sm text-muted-foreground">Multiple ways to measure success</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10"
        >
          <Zap class="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-medium text-foreground mb-1">Data-Driven Decisions</h4>
            <p class="text-sm text-muted-foreground">Make informed choices with real metrics</p>
          </div>
        </div>
      </div>

      <!-- Key Benefits -->
      <div
        class="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-border/30"
      >
        <div class="flex items-center space-x-2 mb-4">
          <Sparkles class="w-5 h-5 text-primary" />
          <h4 class="font-semibold text-foreground">Discover Hidden Profits</h4>
        </div>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-primary flex-shrink-0" />
            <span>Identify your most profitable farming methods</span>
          </li>
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-primary flex-shrink-0" />
            <span>Compare different map types and investment levels</span>
          </li>
          <li class="flex items-center space-x-2">
            <ArrowRight class="w-3 h-3 text-primary flex-shrink-0" />
            <span>Optimize your time for maximum divine returns</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right Side: Mock Chart -->
    <div class="relative">
      <!-- Decorative Elements -->
      <div class="absolute -top-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

      <Card class="relative bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center space-x-2 text-lg">
              <BarChart3 class="w-5 h-5 text-secondary-foreground" />
              <span>Strategy Comparison</span>
            </CardTitle>
            <Badge variant="secondary" class="text-xs">Live Data</Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="h-64 w-full">
            <BarChart
              :data="mockChartData"
              index="name"
              :categories="['divPerHour', 'divPerMap']"
              :y-formatter="
                (tick) => {
                  return typeof tick === 'number' ? `${tick.toFixed(1)} div` : ''
                }
              "
              class="h-full"
              :show-x-axis="true"
              :show-y-axis="true"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Best Strategy:</span>
              <span class="font-medium text-primary">{{ topStrategy.name }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Total Sessions:</span>
              <span class="font-medium text-foreground">{{ mockChartData.length }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Avg. Performance:</span>
              <span class="font-medium text-accent"
                >{{
                  (
                    mockChartData.reduce((sum, item) => sum + item.divPerHour, 0) /
                    mockChartData.length
                  ).toFixed(1)
                }}
                div/h</span
              >
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
