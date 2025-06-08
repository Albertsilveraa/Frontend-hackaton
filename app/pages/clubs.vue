<script setup lang="ts">
import { comunidades } from '~/utils/clubsFormat'

const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})

definePageMeta({ middleware: 'auth', layout: 'dashboard' })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      title="Clubs"
      description="Conoce los clubs de estudiantes de la UTP y las actividades que realizan. Participa en
      eventos, talleres y proyectos colaborativos, amplía tu red de contactos y potencia tu
      vida universitaria al máximo."
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <NuxtLink
            to="#comunidades"
          >
            <UButton
              :label="page.links[0]?.label"
              v-bind="page.links[0]"
              color="neutral"
              class="cursor-pointer"
            />
          </NuxtLink>
          <UButton
            :to="`mailto:${global.email}`"
            v-bind="page.links[1]"
            color="error"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      id="comunidades"
      :ui="{ container: '!pt-0' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Motion
          v-for="(comunidad, index) in comunidades"
          :key="comunidad.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <UBlogPost
            :title="comunidad.title"
            :description="comunidad.description"
            :image="comunidad.image"
            :date="comunidad.date"
            :to="comunidad.to"
            orientation="vertical"
            variant="outline"
            :authors="comunidad.authors"
          />
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
