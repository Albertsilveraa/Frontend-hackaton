<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import { testimonials } from '~/utils/testimonials'

const props = defineProps<{
  page: IndexCollectionItem
}>()

const items = computed(() => {
  return props.page.faq?.categories.map((faq) => {
    return {
      label: faq.title,
      key: faq.title.toLowerCase(),
      questions: faq.questions
    }
  })
})
</script>

<template>
  <UPageSection
    title="Opiniones"
    description="Lo que dicen nuestros profesores y estudiantes sobre la plataforma"
    :ui="{
      container: 'px-0 !pt-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <Motion
      :initial="{ opacity: 0, y: 50 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.7, delay: 0.1 }"
      :in-view-options="{ once: true }"
    >
      <UPageColumns>
        <UPageCard
          v-for="(testimonial, index) in testimonials"
          :key="index"
          :variant="testimonial.variant || 'outline'"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="xl"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </Motion>

    <Motion
      :initial="{ opacity: 0, y: 50 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.7, delay: 0.1 }"
      :in-view-options="{ once: true }"
    >
      <UPageSection
        title="Preguntas frecuentes"
        description="Preguntas frecuentes sobre la plataforma"
      >
        <UTabs
          :items
          orientation="horizontal"
        >
          <template #content="{ item }">
            <UPageAccordion
              trailing-icon="lucide:plus"
              :items="item.questions"
              :ui="{
                item: 'border-none',
                trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50',
                trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135'
              }"
            >
              <template #body="{ item: _item }">
                <MDC
                  :value="_item.content"
                  unwrap="p"
                  class="px-4"
                />
              </template>
            </UPageAccordion>
          </template>
        </UTabs>
      </UPageSection>
    </Motion>
  </UPageSection>
</template>
