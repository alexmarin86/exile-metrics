<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowRight,
  BarChart,
  Target,
  Timer,
  SlidersHorizontal,
  MousePointerClick,
} from 'lucide-vue-next'
</script>

<template>
  <section
    class="bg-[image:var(--hero-bg)] bg-no-repeat bg-center min-h-[80dvh] dark:mask-radial-from-60% dark:mask-ellipse shadow-background shadow-lg p-12 bg-cover xl:bg-auto"
  >
    <h1
      class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-center text-background dark:text-foreground text-balance w-4/6 mx-auto leading-14 tracking-tight"
    >
      Track your <span class="text-accent font-bold">farming sessions</span> with minimal
      configuration!
    </h1>
    <ul
      class="text-muted-foreground text-base grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16"
    >
      <li class="flex items-center bg-primary-foreground/80 p-6 rounded-lg gap-4">
        <div class="w-16 h-16">
          <BarChart :size="64" class="size-16 text-primary" />
        </div>
        <div class="space-y-2">
          <p class="text-base text-muted-foreground font-medium">
            Skip the spreadsheets. Track profit, time, and loot without the hassle.
          </p>
          <Separator class="bg-muted-foreground/60" />
          <p class="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Log your sessions effortlessly and get a clear view of your farming returns without
            touching Excel.
          </p>
        </div>
      </li>

      <li class="flex items-center bg-primary-foreground/80 p-6 rounded-lg gap-4">
        <div class="w-16 h-16">
          <Target :size="64" class="size-16 text-primary" />
        </div>
        <div class="space-y-2">
          <p class="text-base text-muted-foreground font-medium">
            Purpose-built for focused farming, no matter your playstyle.
          </p>
          <Separator class="bg-muted-foreground/60" />
          <p class="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Whether you're running Legion, Delirium, or alc-and-go mapping, your data stays useful
            and clean.
          </p>
        </div>
      </li>

      <li class="flex items-center bg-primary-foreground/80 p-6 rounded-lg gap-4">
        <div class="w-16 h-16">
          <Timer :size="64" class="size-16 text-primary" />
        </div>
        <div class="space-y-2">
          <p class="text-base text-muted-foreground font-medium">
            Get insights into your mapping efficiency in seconds.
          </p>
          <Separator class="bg-muted-foreground/60" />
          <p class="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Measure your time spent in maps and evaluate how different mapping strategies impact
            your profits.
          </p>
        </div>
      </li>

      <li class="flex items-center bg-primary-foreground/80 p-6 rounded-lg gap-4">
        <div class="w-16 h-16">
          <SlidersHorizontal :size="64" class="size-16 text-primary" />
        </div>
        <div class="space-y-2">
          <p class="text-base text-muted-foreground font-medium">
            Designed for Path of Exile players who hate overcomplicating things.
          </p>
          <Separator class="bg-muted-foreground/60" />
          <p class="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Enter your session details in seconds and focus on mapping, not fiddling with
            spreadsheets or custom setups.
          </p>
        </div>
      </li>

      <li class="flex items-center bg-primary-foreground/80 p-6 rounded-lg gap-4">
        <div class="w-16 h-16">
          <MousePointerClick :size="64" class="size-16 text-primary" />
        </div>
        <div class="space-y-2">
          <p class="text-base text-muted-foreground font-medium">
            Smarter mapping begins with better data. Start tracking your sessions today!
          </p>
          <Separator class="bg-muted-foreground/60" />
          <p class="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Discover what works best for your goals by comparing map outcomes and refining your
            strategy over time.
          </p>
        </div>
      </li>

      <li
        class="flex items-center justify-between gap-4 p-6 bg-primary/80 rounded-lg border border-border"
      >
        <p class="text-base text-card">
          Ready to dive in? Start tracking your next mapping session now.
        </p>
        <Button variant="secondary" size="lg">
          <RouterLink to="/sessions/new">New session</RouterLink>
          <ArrowRight class="ml-2 w-4 h-4" />
        </Button>
      </li>
    </ul>
  </section>
</template>
