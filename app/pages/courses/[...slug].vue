<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { plans } from '~/utils/plansCourses'
import { courseTrees } from '~/utils/courseTrees'
import {
  findPageBreadcrumb,
  mapContentNavigation
} from '#ui-pro/utils/content'

const route = useRoute()
const slug = computed(() => page.value?.path?.split('/').pop() || '')
const items = computed(() => courseTrees[slug.value] || [])
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const articleLink = computed(() => `${window?.location}`)

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('courses').path(route.path).first()
)

if (!page.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('courses', route.path, {
    fields: ['description']
  })
)

const coursesNavigation = computed(
  () =>
    navigation.value.find(item => item.path === '/courses')?.children || []
)

const breadcrumb = computed(() =>
  mapContentNavigation(
    findPageBreadcrumb(coursesNavigation?.value, page.value)
  ).map(({ icon, ...link }) => link)
)

if (page.value.image) {
  defineOgImage({ url: page.value.image })
} else {
  defineOgImageComponent(
    'Courses',
    {
      headline: breadcrumb.value.map(item => item.label).join(' > ')
    },
    {
      fonts: ['Geist:400', 'Geist:600']
    }
  )
}

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

definePageMeta({ middleware: 'auth', layout: 'dashboard' })
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <ULink
          to="/courses"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Cursos
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div
            class="flex text-xs text-muted items-center justify-center gap-2"
          >
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead"> - </span>
            <span v-if="page.minRead"> {{ page.minRead }} MIN READ </span>
          </div>
          <NuxtImg
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full h-[300px] object-cover object-center"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              v-bind="page.author"
            />
          </div>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <UPageSection
            :ui="{
              container: '!pt-0 !pb-0 !pl-0 !pr-0 bg-primary/4 rounded-lg'
            }"
          >
            <Motion
              :initial="{ opacity: 0, transform: 'translateY(10px)' }"
              :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.4 }"
              :in-view-options="{ once: true }"
            >
              <UTree
                color="error"
                :items="items"
                size="xl"
              />
            </Motion>
          </UPageSection>

          <Motion
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.4 }"
            :in-view-options="{ once: true }"
          >
            <UPricingPlans
              orientation="vertical"
              :plans="plans"
              @click="copyToClipboard(articleLink, 'Te haz inscrito al curso')"
            />
          </Motion>
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
