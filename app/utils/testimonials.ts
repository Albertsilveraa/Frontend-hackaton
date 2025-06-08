type Variant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'naked'

export const testimonials = ref<Array<{
  user: { name: string, description: string, avatar: { src: string, alt: string } }
  quote: string
  variant?: Variant
}>>([
  {
    user: {
      name: 'María Salazar',
      description: 'Estudiante de Ingeniería Industrial',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/44.jpg',
        alt: 'María Salazar'
      }
    },
    quote: 'Gracias a UTP CLUBS pude organizarme mejor y aprobar Matemática General a la primera. ¡Los resúmenes semanales y los foros son una maravilla!',
    variant: 'subtle'
  },
  {
    user: {
      name: 'Dr. José Paredes',
      description: 'Profesor de Física',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/47.jpg',
        alt: 'José Paredes'
      }
    },
    quote: 'La plataforma facilita el seguimiento de los estudiantes y les da herramientas que mejoran el aprendizaje autónomo.',
    variant: 'solid'
  },
  {
    user: {
      name: 'Carlos Ramos',
      description: 'Estudiante de Química',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/32.jpg',
        alt: 'Carlos Ramos'
      }
    },
    quote: 'Poder repasar antes de los exámenes con los materiales y quizzes interactivos realmente marcó la diferencia.',
    variant: 'subtle'
  },
  {
    user: {
      name: 'Dra. Ana Torres',
      description: 'Coordinadora de Idiomas',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/60.jpg',
        alt: 'Ana Torres'
      }
    },
    quote: 'Es muy motivador ver cómo los estudiantes mejoran su inglés usando la plataforma. El apoyo que reciben es integral.',
    variant: 'solid'
  },
  {
    user: {
      name: 'Eduardo Vega',
      description: 'Estudiante de primer ciclo',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/60.jpg',
        alt: 'Eduardo Vega'
      }
    },
    quote: 'Al principio me costaba mucho adaptarme a la universidad, pero UTP CLUBS me dio estructura y confianza.',
    variant: 'subtle'
  },
  {
    user: {
      name: 'Lisseth Ramírez',
      description: 'Profesora de Matemática',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/55.jpg',
        alt: 'Lisseth Ramírez'
      }
    },
    quote: 'UTP CLUBS permite que los estudiantes avancen a su propio ritmo y refuercen lo aprendido en clase.',
    variant: 'solid'
  },
  {
    user: {
      name: 'Javier Meza',
      description: 'Estudiante de Sistemas',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/27.jpg',
        alt: 'Javier Meza'
      }
    },
    quote: 'La función de alertas y recordatorios me ayudó a nunca perder una entrega importante.',
    variant: 'subtle'
  },
  {
    user: {
      name: 'Lucía Flores',
      description: 'Estudiante de Administración',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/31.jpg',
        alt: 'Lucía Flores'
      }
    },
    quote: 'La comunidad y los foros me permitieron resolver dudas rápidamente y conocer a otros compañeros.',
    variant: 'subtle'
  },
  {
    user: {
      name: 'Marco Ortega',
      description: 'Profesor de Química',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/45.jpg',
        alt: 'Marco Ortega'
      }
    },
    quote: 'Los materiales interactivos son una gran ayuda para hacer más dinámica la enseñanza y el aprendizaje.',
    variant: 'solid'
  }
])
