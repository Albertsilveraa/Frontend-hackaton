<script setup lang="ts">
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

const comunidades = [
  {
    title: 'Club de Programación',
    description:
      'Espacio para aprender, compartir y participar en retos de código y tecnología.',
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: '2024-06-12',
    to: '#',
    authors: [
      {
        name: 'Ana Ruiz',
        avatar: { src: 'https://randomuser.me/api/portraits/women/51.jpg' }
      },
      {
        name: 'Pedro Sánchez',
        avatar: { src: 'https://randomuser.me/api/portraits/men/45.jpg' }
      },
      {
        name: 'Luisa Torres',
        avatar: { src: 'https://randomuser.me/api/portraits/women/52.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: { src: 'https://randomuser.me/api/portraits/men/49.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: {
          src: 'https://i.ibb.co/cKGDKWcK/Chat-GPT-Image-7-jun-2025-09-38-58-p-m.png'
        }
      }
    ]
  },
  {
    title: 'UTP Deportes',
    description:
      'Vive la pasión por el deporte, participa en torneos y actividades deportivas.',
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: '2024-06-10',
    to: '#',
    authors: [
      {
        name: 'Carlos Jiménez',
        avatar: { src: 'https://randomuser.me/api/portraits/men/55.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: { src: 'https://randomuser.me/api/portraits/women/69.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: { src: 'https://randomuser.me/api/portraits/women/18.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: { src: 'https://randomuser.me/api/portraits/women/17.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: {
          src: 'https://i.ibb.co/cKGDKWcK/Chat-GPT-Image-7-jun-2025-09-38-58-p-m.png'
        }
      }
    ]
  },
  {
    title: 'Club de Ciencia y Sociedad',
    description:
      'Explora proyectos de investigación, ferias y actividades para cambiar tu entorno.',
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: '2024-06-09',
    to: '#',
    authors: [
      {
        name: 'Sofía Mendoza',
        avatar: { src: 'https://randomuser.me/api/portraits/women/39.jpg' }
      },
      {
        name: 'Esteban Gómez',
        avatar: { src: 'https://randomuser.me/api/portraits/men/42.jpg' }
      },
      {
        name: 'Andrés López',
        avatar: { src: 'https://randomuser.me/api/portraits/men/41.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: { src: 'https://randomuser.me/api/portraits/women/84.jpg' }
      },
      {
        name: 'Marta Aguilar',
        avatar: {
          src: 'https://i.ibb.co/cKGDKWcK/Chat-GPT-Image-7-jun-2025-09-38-58-p-m.png'
        }
      }
    ]
  },
  {
    title: 'Club de Ciencia y Sociedad',
    description:
      'Explora proyectos de investigación, ferias y actividades para cambiar tu entorno.',
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: '2024-06-09',
    to: '#',
    authors: [
      {
        name: 'Sofía Mendoza',
        avatar: { src: 'https://randomuser.me/api/portraits/women/15.jpg' }
      },
      {
        name: 'Esteban Gómez',
        avatar: { src: 'https://randomuser.me/api/portraits/men/29.jpg' }
      },
      {
        name: 'Andrés López',
        avatar: { src: 'https://randomuser.me/api/portraits/men/30.jpg' }
      },
      {
        name: 'Esteban Gómez',
        avatar: { src: 'https://randomuser.me/api/portraits/men/17.jpg' }
      },
      {
        name: 'Andrés López',
        avatar: {
          src: 'https://i.ibb.co/cKGDKWcK/Chat-GPT-Image-7-jun-2025-09-38-58-p-m.png'
        }
      }
    ]
  }
]

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      title="Comunidades"
      description="Conoce las comunidades de estudiantes de la UTP y las actividades que realizan. Participa en
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
