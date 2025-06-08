<script setup lang="ts">
import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  {
    question: '¿Qué tan cómodo te sientes aprendiendo conceptos teóricos complejos? Piensa en materias como matemáticas, física o filosofía',
    items: ['Muy incómodo', 'Muy cómodo'],
    value: ref<RadioGroupValue>('Muy incómodo')
  },
  {
    question: '¿Prefieres aprender haciendo ejercicios prácticos? Laboratorios, proyectos, experimentos',
    items: ['Nunca', 'Siempre'],
    value: ref<RadioGroupValue>('Nunca')
  },
  {
    question: '¿Qué tan autodisciplinado eres con tu tiempo de estudio? Organización, cumplimiento de horarios, constancia',
    items: ['Nada disciplinado', 'Muy disciplinado'],
    value: ref<RadioGroupValue>('Nada disciplinado')
  },
  {
    question: '¿Te motiva competir académicamente con otros estudiantes? Rankings, calificaciones comparativas, desafíos',
    items: ['No me motiva', 'Me motiva mucho'],
    value: ref<RadioGroupValue>('No me motiva')
  },
  {
    question: '¿Prefieres estudiar contenido multimedia (videos, audio, animaciones)? En lugar de solo texto y libros',
    items: ['Solo texto', 'Solo multimedia'],
    value: ref<RadioGroupValue>('Solo texto')
  },
  {
    question: '¿Qué tan importante es recibir feedback constante sobre tu progreso? Comentarios, correcciones, evaluaciones frecuentes',
    items: ['No necesito feedback', 'Necesito feedback constante'],
    value: ref<RadioGroupValue>('No necesito feedback')
  },
  {
    question: '¿Qué tan importante es para ti entender el \'por qué\' detrás de cada concepto? Profundidad vs. aplicación directa',
    items: ['Solo quiero aplicar', 'Necesito entender todo'],
    value: ref<RadioGroupValue>('Solo quiero aplicar')
  },
  {
    question: '¿Te adaptas fácilmente a nuevos métodos de enseñanza? Flexibilidad ante cambios en la forma de aprender',
    items: ['Me cuesta adaptarme', 'Me adapto muy fácil'],
    value: ref<RadioGroupValue>('Me cuesta adaptarme')
  }
]

const currentIndex = ref(0)
const transitioning = ref(false)

const next = () => {
  if (transitioning.value) return
  transitioning.value = true

  setTimeout(() => {
    if (currentIndex.value < questions.length - 1) {
      currentIndex.value++
    } else {
      router.push('/')
    }
    transitioning.value = false
  }, 300)
}

const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  navigateTo('/')
}

useSeoMeta({
  title: 'Cuestionario - UTP+clubs',
  description: 'Responde el cuestionario para ser parte de la comunidad.'
})

definePageMeta({ layout: false })
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img
          src="https://i.ibb.co/Q3Br9xky/Chat-GPT-Image-8-jun-2025-05-05-05-p-m.png"
          width="200"
        >
        <div class="brand-section">
          <h2>🎯 Evaluación de Perfil de Aprendizaje</h2>
          <p>Responde estas preguntas para crear tu ruta personalizada</p>
        </div>
      </div>

      <div class="login-form-section">
        <div class="login-form">
          <Transition
            name="slide-fade"
            mode="out-in"
          >
            <div
              :key="currentIndex"
              class="form-group"
            >
              <label class="question">{{ questions[currentIndex].question }}</label>
              <URadioGroup
                v-model="questions[currentIndex].value"
                color="primary"
                class="radio-group"
                :items="questions[currentIndex].items"
              />
            </div>
          </Transition>

          <button
            type="button"
            class="login-button"
            @click="next"
          >
            <span>Continuar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  background: #f8fafc;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.brand-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0.5rem 0;
}

.brand-section p {
  color: #6b7280;
  font-size: 1rem;
}

.login-form-section {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form {
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.form-group {
  display: flex;
  flex-direction: column;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
}

.form-group .question {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

.login-button {
  width: 100%;
  background: #000;
  color: white;
  border: none;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.login-button:hover:not(:disabled) {
  background: #374151;
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .login-card {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .login-header {
    padding: 2rem 1rem;
  }

  .login-form-section {
    padding: 2rem 1rem;
  }

  .brand-section h2 {
    font-size: 1.25rem;
  }
}
</style>
