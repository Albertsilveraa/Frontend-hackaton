<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content'
import { computed } from 'vue'

type Achievement = {
  category: 'Programación' | 'Análisis de Datos' | 'Desarrollo Web'
  title: string
  date: Date | string
  description: string
  certificateUrl?: string
}

type ExtendedAboutCollection = AboutCollectionItem & {
  achievements: Achievement[]
}

const props = defineProps<{
  page: ExtendedAboutCollection
}>()

console.log('Page data:', props.page)

const groupedAchievements = computed(() => {
  const achievements = props.page?.achievements || []
  console.log('Achievements:', achievements)

  const groups = {
    'Programación': achievements.filter(a => a.category === 'Programación'),
    'Análisis de Datos': achievements.filter(
      a => a.category === 'Análisis de Datos'
    ),
    'Desarrollo Web': achievements.filter(
      a => a.category === 'Desarrollo Web'
    )
  }

  console.log('Grouped:', groups)
  return groups
})

const formatDate = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <UPageSection
    title="Logros"
    description="Tus ultimos logros"
    :ui="{
      container: '!p-0 gap-8 sm:gap-8',
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl font-medium',
      description: 'mt-2 text-muted text-left'
    }"
  >
    <div class="mt-8 space-y-16">
      <div
        v-for="(achievementsInCategory, category) in groupedAchievements"
        v-show="achievementsInCategory.length > 0"
        :key="category"
        class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8"
      >
        <div class="lg:col-span-1 mb-4 lg:mb-0">
          <h2
            class="lg:sticky lg:top-16 text-xl font-semibold tracking-tight text-highlighted"
          >
            {{ category }}
          </h2>
        </div>

        <div class="lg:col-span-2 space-y-8">
          <Motion
            v-for="(achievement, index) in achievementsInCategory"
            :key="index"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.2 * index }"
            :in-view-options="{ once: true }"
          >
            <div class="group relative pl-6 border-l border-default">
              <div class="mb-1 text-sm font-medium text-muted">
                {{ formatDate(achievement.date) }}
              </div>

              <h3 class="text-lg font-semibold text-highlighted">
                {{ achievement.title }}
              </h3>

              <p class="mt-2 text-muted">
                {{ achievement.description }}
              </p>

              <UButton
                v-if="achievement.certificateUrl"
                :to="achievement.certificateUrl"
                target="_blank"
                label="Ver certificado"
                variant="link"
                class="p-0 pt-2 gap-0"
              >
                <template #trailing>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </template>
              </UButton>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
