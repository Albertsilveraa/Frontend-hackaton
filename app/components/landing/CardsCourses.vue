<script setup lang="ts">
type HighlightColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'neutral'

interface Teacher {
  name: string
  description: string
  avatar: {
    src: string
    alt: string
  }
}

interface Course {
  title: string
  description: string
  icon: string
  to: string
  highlightColor: HighlightColor
  teacher: Teacher
}

const courses: Course[] = [
  {
    title: 'Inglés',
    description:
      'Mejora tus habilidades en el idioma inglés con ejercicios interactivos.',
    icon: 'i-heroicons-language',
    to: '#',
    highlightColor: 'primary',
    teacher: {
      name: 'Dra. Laura López',
      description: 'Responsable de Inglés',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/50.jpg',
        alt: 'Dra. Laura López'
      }
    }
  },
  {
    title: 'Física',
    description:
      'Aprende los principios de la física y resuelve problemas prácticos.',
    icon: 'i-heroicons-cube-transparent',
    to: '#',
    highlightColor: 'neutral',
    teacher: {
      name: 'Mtro. Juan Pérez',
      description: 'Responsable de Física',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/32.jpg',
        alt: 'Mtro. Juan Pérez'
      }
    }
  },
  {
    title: 'Química',
    description: 'Explora el mundo de los elementos y las reacciones químicas.',
    icon: 'i-heroicons-beaker',
    to: '#',
    highlightColor: 'success',
    teacher: {
      name: 'Dra. Alicia Mendoza',
      description: 'Responsable de Química',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/45.jpg',
        alt: 'Dra. Alicia Mendoza'
      }
    }
  },
  {
    title: 'Matemáticas',
    description: 'Desarrolla tu razonamiento lógico y matemático.',
    icon: 'i-heroicons-calculator',
    to: '#',
    highlightColor: 'warning',
    teacher: {
      name: 'Ing. Carlos Ramírez',
      description: 'Responsable de Matemáticas',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/23.jpg',
        alt: 'Ing. Carlos Ramírez'
      }
    }
  },
  {
    title: 'Historia',
    description: 'Comprende los eventos y procesos históricos clave.',
    icon: 'i-heroicons-book-open',
    to: '#',
    highlightColor: 'success',
    teacher: {
      name: 'Lic. Gabriela Suárez',
      description: 'Responsable de Historia',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/65.jpg',
        alt: 'Lic. Gabriela Suárez'
      }
    }
  },
  {
    title: 'Computación',
    description: 'Aprende fundamentos de computación y programación.',
    icon: 'i-heroicons-computer-desktop',
    to: '#',
    highlightColor: 'error',
    teacher: {
      name: 'Dr. Emilio Torres',
      description: 'Responsable de Computación',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/55.jpg',
        alt: 'Dr. Emilio Torres'
      }
    }
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <UPageCard
      v-for="(course, idx) in courses"
      :key="idx"
      :title="course.title"
      :description="course.description"
      :icon="course.icon"
      :to="course.to"
      target="_blank"
      variant="soft"
    >
      <template #footer>
        <UUser v-bind="course.teacher" />
      </template>
    </UPageCard>
  </div>
</template>
