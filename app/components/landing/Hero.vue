<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import WeeklyStreak from './WeeklyStreak.vue'
import CardsCourses from './CardsCourses.vue'

defineProps<{
  page: IndexCollectionItem
}>()

const days = Array.from({ length: 31 }, (_, i) => i < 11)
</script>

<template>
  <UPageHero>
    <template #headline>
      <Motion
        :initial="{ opacity: 0, y: 50 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.1 }"
        :in-view-options="{ once: true }"
      >
        <UPageSection
          :ui="{
            container: 'flex items-center justify-center !py-0 !my-0 min-h-0'
          }"
        >
          <WeeklyStreak :days="days" />
        </UPageSection>
      </Motion>
    </template>

    <Motion
      :initial="{
        scale: 1.1,
        opacity: 0,
        filter: 'blur(20px)'
      }"
      :animate="{
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)'
      }"
      :transition="{
        duration: 0.6,
        delay: 0.1
      }"
    >
      <UPageSection
        title="Cursos Generales"
        :ui="{
          container: 'flex items-center justify-center !py-0 !my-0 min-h-0',
          title: 'text-left'
        }"
      >
        <CardsCourses />
      </UPageSection>
    </Motion>
  </UPageHero>
</template>
