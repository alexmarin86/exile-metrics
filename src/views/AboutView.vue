<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="container mx-auto py-12 space-y-12">
    <!-- Hero Section -->
    <div class="text-center space-y-6">
      <h1 class="text-4xl font-bold text-foreground">About Exile Metrics</h1>
      <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
        A free and open source tool designed for Path of Exile players who want to optimize their
        mapping strategies without the complexity.
      </p>
    </div>

    <!-- What is Exile Metrics -->
    <section class="space-y-6">
      <h2 class="text-3xl font-semibold text-foreground">What is Exile Metrics?</h2>
      <div class="prose prose-lg max-w-none dark:prose-invert">
        <p>
          Exile Metrics is a comprehensive farming session tracking application built specifically
          for Path of Exile players. Our tool helps you measure the profitability of different
          mapping strategies by tracking your time investment, costs, and returns in an intuitive
          and streamlined way.
        </p>
      </div>
    </section>

    <!-- Key Features -->
    <section class="space-y-6">
      <h2 class="text-3xl font-semibold text-foreground">Key Features</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-card rounded-lg p-6 border">
          <h3 class="text-xl font-semibold mb-3 text-foreground">Session Tracking</h3>
          <p class="text-muted-foreground">
            Create detailed farming sessions with map information, scarab usage, chisel costs, and
            map device crafts. Track multiple sessions and compare their effectiveness.
          </p>
        </div>

        <div class="bg-card rounded-lg p-6 border">
          <h3 class="text-xl font-semibold mb-3 text-foreground">Time Management</h3>
          <p class="text-muted-foreground">
            Built-in stint timer system to accurately measure time spent mapping. Get precise
            metrics on divines per hour and profitability per map.
          </p>
        </div>

        <div class="bg-card rounded-lg p-6 border">
          <h3 class="text-xl font-semibold mb-3 text-foreground">Cost Analysis</h3>
          <p class="text-muted-foreground">
            Comprehensive cost breakdown including maps, scarabs, chisels, and crafting costs.
            Automatic calculations help you understand your true profit margins.
          </p>
        </div>

        <div class="bg-card rounded-lg p-6 border">
          <h3 class="text-xl font-semibold mb-3 text-foreground">Strategy Comparison</h3>
          <p class="text-muted-foreground">
            Visual charts comparing different farming strategies side by side. Make data-driven
            decisions about which methods work best for you.
          </p>
        </div>
      </div>
    </section>

    <!-- Our Philosophy -->
    <section class="space-y-6">
      <h2 class="text-3xl font-semibold text-foreground">Our Philosophy</h2>
      <div class="bg-primary-foreground/60 rounded-lg p-8 border">
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <p>
            <strong
              >Exile Metrics is designed for Path of Exile players who hate overcomplicating
              things.</strong
            >
            We believe that tracking your farming efficiency shouldn't require complex spreadsheets,
            custom setups, or hours of configuration.
          </p>
          <p>
            Our goal is simple: enter your session details in seconds and focus on mapping, not
            fiddling with tools. We've built an intuitive interface that gets out of your way and
            lets you concentrate on what matters most: playing the game and optimizing your
            strategies.
          </p>
        </div>
      </div>
    </section>

    <!-- Free and Open Source -->
    <section class="space-y-6">
      <h2 class="text-3xl font-semibold text-foreground">Free and Open Source</h2>
      <div
        class="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-8"
      >
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <p class="text-green-800 dark:text-green-200">
            <strong>Exile Metrics is completely free to use and will always remain so.</strong>
            We believe that tools to enhance your gaming experience should be accessible to
            everyone, regardless of their financial situation.
          </p>
          <p class="text-green-700 dark:text-green-300">
            Our source code is released under the
            <strong>GNU General Public License v3 (GPLv3)</strong>, ensuring that this project
            remains free and open for the entire Path of Exile community. This means you have the
            freedom to:
          </p>
          <ul class="text-green-700 dark:text-green-300">
            <li>Use the application for any purpose</li>
            <li>Study how it works and modify it to suit your needs</li>
            <li>Distribute copies to help your friends</li>
            <li>Improve the program and share your improvements with the community</li>
          </ul>
          <p class="text-green-700 dark:text-green-300">
            You can find our complete source code on GitHub, and we welcome contributions from the
            community. Together, we can build better tools for all Path of Exile players.
          </p>
        </div>
      </div>
    </section>

    <!-- Community and Support -->
    <section class="space-y-6">
      <h2 class="text-3xl font-semibold text-foreground">Community & Support</h2>
      <div class="bg-card rounded-lg p-8 border space-y-4">
        <p class="text-muted-foreground">
          Exile Metrics is built by Path of Exile players, for Path of Exile players. We're
          committed to continuous improvement based on community feedback and the evolving needs of
          the game.
        </p>
        <p class="text-muted-foreground">
          Found a bug? Have a feature request? Want to contribute to the project? We'd love to hear
          from you! Use our contact form to get in touch, and we typically respond within 24-48
          hours.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <RouterLink
            to="/contact"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </RouterLink>
          <a
            href="https://github.com/alexmarin86/exile-metrics"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">Disclaimer</h2>
      <div class="bg-muted/50 rounded-lg p-6 border text-sm text-muted-foreground">
        <p>
          Exile Metrics is a community project and is not affiliated with, endorsed by, or connected
          to Grinding Gear Games or Path of Exile in any official capacity. Path of Exile is a
          trademark of Grinding Gear Games Ltd.
        </p>
      </div>
    </section>
  </main>
</template>
