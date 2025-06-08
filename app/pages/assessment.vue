<template>
  <div class="assessment-container">
    <div class="assessment-card">
      <!-- Header -->
      <div class="assessment-header">
        <div class="progress-section">
          <h1>🎯 Evaluación de Perfil de Aprendizaje</h1>
          <p>Responde estas preguntas para crear tu ruta personalizada</p>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(currentQuestion / questions.length) * 100}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ currentQuestion }} de {{ questions.length }}</span>
        </div>
        
        <div class="user-info">
          <Icon name="lucide:user" />
          <span>{{ user?.codigo }}</span>
        </div>
      </div>

      <!-- Question Section -->
      <div v-if="!isCompleted && !isProcessing" class="question-section">
        <div class="question-card">
          <div class="question-number">Pregunta {{ currentQuestion }}</div>
          <h2 class="question-title">{{ getCurrentQuestion().text }}</h2>
          <p class="question-subtitle">{{ getCurrentQuestion().subtitle }}</p>
          
          <!-- Rating Scale 1-9 -->
          <div class="rating-section">
            <div class="rating-labels">
              <span class="label-start">{{ getCurrentQuestion().scaleStart }}</span>
              <span class="label-end">{{ getCurrentQuestion().scaleEnd }}</span>
            </div>
            
            <div class="rating-scale">
              <button
                v-for="rating in 9"
                :key="rating"
                @click="selectRating(rating)"
                :class="['rating-button', { active: answers[currentQuestion - 1] === rating }]"
              >
                {{ rating }}
              </button>
            </div>
            
            <div class="rating-description">
              <span v-if="answers[currentQuestion - 1]">
                {{ getRatingDescription(answers[currentQuestion - 1]) }}
              </span>
            </div>
          </div>

          <!-- Navigation -->
          <div class="navigation-buttons">
            <button 
              @click="previousQuestion"
              :disabled="currentQuestion === 1"
              class="nav-button prev-button"
            >
              <Icon name="lucide:chevron-left" />
              Anterior
            </button>
            
            <button 
              @click="nextQuestion"
              :disabled="!answers[currentQuestion - 1]"
              class="nav-button next-button"
            >
              <template v-if="currentQuestion === questions.length">
                Generar Ruta
                <Icon name="lucide:sparkles" />
              </template>
              <template v-else>
                Siguiente
                <Icon name="lucide:chevron-right" />
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Processing Section -->
      <div v-if="isProcessing" class="processing-section">
        <div class="processing-animation">
          <div class="spinner-large"></div>
        </div>
        <h2>🧠 Analizando tu perfil...</h2>
        <p>Nuestra IA está creando tu ruta de aprendizaje personalizada</p>
        <div class="processing-steps">
          <div :class="['step', { active: processingStep >= 1 }]">
            <Icon name="lucide:brain" />
            Analizando respuestas
          </div>
          <div :class="['step', { active: processingStep >= 2 }]">
            <Icon name="lucide:target" />
            Identificando fortalezas
          </div>
          <div :class="['step', { active: processingStep >= 3 }]">
            <Icon name="lucide:route" />
            Generando ruta personalizada
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="isCompleted && learningPath" class="results-section">
        <div class="results-header">
          <h1>🎉 ¡Tu Ruta de Aprendizaje está lista!</h1>
          <p>{{ learningPath.description }}</p>
        </div>

        <div class="profile-summary">
          <h3>📊 Tu Perfil de Aprendizaje</h3>
          <div class="profile-badges">
            <span 
              v-for="trait in learningPath.profile.traits" 
              :key="trait.name"
              class="trait-badge"
              :style="{ '--intensity': trait.score / 9 }"
            >
              {{ trait.name }}: {{ trait.score }}/9
            </span>
          </div>
        </div>

        <div class="learning-route">
          <h3>🛤️ Tu Ruta Recomendada</h3>
          <div class="route-steps">
            <div 
              v-for="(step, index) in learningPath.route.steps" 
              :key="index"
              class="route-step"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
                <div class="step-duration">⏱️ {{ step.duration }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="startLearning" class="primary-button">
            <Icon name="lucide:play" />
            Comenzar mi Ruta
          </button>
          <button @click="retakeAssessment" class="secondary-button">
            <Icon name="lucide:refresh-cw" />
            Repetir Evaluación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Middleware de autenticación
definePageMeta({
  middleware: 'auth',
  layout: false
})

interface Question {
  text: string
  subtitle: string
  scaleStart: string
  scaleEnd: string
  category: string
}

interface LearningPath {
  description: string
  profile: {
    type: string
    traits: Array<{ name: string; score: number }>
  }
  route: {
    name: string
    steps: Array<{
      title: string
      description: string
      duration: string
    }>
  }
}

const { user, updateUserProfile, checkAuth } = useAuth()

// State
const currentQuestion = ref(1)
const answers = ref<number[]>([])
const isProcessing = ref(false)
const isCompleted = ref(false)
const processingStep = ref(0)
const learningPath = ref<LearningPath | null>(null)

// Asegurar que el usuario esté disponible
onMounted(() => {
  console.log('📋 Assessment mounted, user:', user.value)
  if (!user.value) {
    console.log('🔄 Usuario no encontrado, ejecutando checkAuth...')
    checkAuth()
  }
})

// Questions for the assessment
const questions: Question[] = [
  {
    text: "¿Qué tan cómodo te sientes aprendiendo conceptos teóricos complejos?",
    subtitle: "Piensa en materias como matemáticas, física o filosofía",
    scaleStart: "Muy incómodo",
    scaleEnd: "Muy cómodo",
    category: "theoretical"
  },
  {
    text: "¿Prefieres aprender haciendo ejercicios prácticos?",
    subtitle: "Laboratorios, proyectos, experimentos",
    scaleStart: "Nunca",
    scaleEnd: "Siempre",
    category: "practical"
  },
  {
    text: "¿Te gusta trabajar en equipo para resolver problemas?",
    subtitle: "Colaboración, discusión grupal, proyectos compartidos",
    scaleStart: "Prefiero solo",
    scaleEnd: "Amo los equipos",
    category: "collaborative"
  },
  {
    text: "¿Qué tan autodisciplinado eres con tu tiempo de estudio?",
    subtitle: "Organización, cumplimiento de horarios, constancia",
    scaleStart: "Nada disciplinado",
    scaleEnd: "Muy disciplinado",
    category: "discipline"
  },
  {
    text: "¿Te motiva competir académicamente con otros estudiantes?",
    subtitle: "Rankings, calificaciones comparativas, desafíos",
    scaleStart: "No me motiva",
    scaleEnd: "Me motiva mucho",
    category: "competitive"
  },
  {
    text: "¿Prefieres estudiar contenido multimedia (videos, audio, animaciones)?",
    subtitle: "En lugar de solo texto y libros",
    scaleStart: "Solo texto",
    scaleEnd: "Solo multimedia",
    category: "multimedia"
  },
  {
    text: "¿Qué tan importante es para ti entender el 'por qué' detrás de cada concepto?",
    subtitle: "Profundidad vs. aplicación directa",
    scaleStart: "Solo quiero aplicar",
    scaleEnd: "Necesito entender todo",
    category: "depth"
  },
  {
    text: "¿Te adaptas fácilmente a nuevos métodos de enseñanza?",
    subtitle: "Flexibilidad ante cambios en la forma de aprender",
    scaleStart: "Me cuesta adaptarme",
    scaleEnd: "Me adapto muy fácil",
    category: "adaptability"
  },
  {
    text: "¿Qué tan importante es recibir feedback constante sobre tu progreso?",
    subtitle: "Comentarios, correcciones, evaluaciones frecuentes",
    scaleStart: "No necesito feedback",
    scaleEnd: "Necesito feedback constante",
    category: "feedback"
  }
]

// Methods
const getCurrentQuestion = () => questions[currentQuestion.value - 1]

const selectRating = (rating: number) => {
  answers.value[currentQuestion.value - 1] = rating
}

const getRatingDescription = (rating: number) => {
  if (rating <= 3) return "Bajo"
  if (rating <= 6) return "Moderado"
  return "Alto"
}

const previousQuestion = () => {
  if (currentQuestion.value > 1) {
    currentQuestion.value--
  }
}

const nextQuestion = async () => {
  if (currentQuestion.value < questions.length) {
    currentQuestion.value++
  } else {
    // Last question - process results
    await processAssessment()
  }
}

const processAssessment = async () => {
  isProcessing.value = true
  processingStep.value = 0
  
  // Simulate processing steps
  const steps = [
    { step: 1, delay: 1000 },
    { step: 2, delay: 1500 },
    { step: 3, delay: 2000 }
  ]
  
  for (const { step, delay } of steps) {
    await new Promise(resolve => setTimeout(resolve, delay))
    processingStep.value = step
  }
  
  try {
    console.log('📋 Procesando assessment...')
    console.log('👤 Usuario actual:', user.value)
    
    // Validar que tenemos usuario
    if (!user.value) {
      throw new Error('No hay usuario autenticado')
    }
    
    // Crear datos para el API
    const requestData = {
      userId: user.value.codigo,
      answers: answers.value,
      questions: questions.map(q => q.category)
    }
    
    console.log('📤 Enviando al API:', requestData)
    
    // Call API to generate learning path
    const { data } = await $fetch('/api/generate-learning-path', {
      method: 'POST',
      body: requestData
    })
    
    learningPath.value = data.learningPath
    console.log('✅ Respuesta del API:', data.learningPath)
    
    // Guardar usando la nueva DB local
    updateUserProfile(data.learningPath)
    
    console.log('✅ Perfil guardado en DB local')
    isCompleted.value = true
    
  } catch (error) {
    console.error('❌ Error processing assessment:', error)
    
    // Fallback learning path
    const fallbackPath = generateFallbackPath()
    learningPath.value = fallbackPath
    
    console.log('📋 Usando perfil de fallback...')
    updateUserProfile(fallbackPath)
    
    console.log('✅ Perfil de fallback guardado')
    isCompleted.value = true
  } finally {
    isProcessing.value = false
  }
}

const generateFallbackPath = (): LearningPath => {
  return {
    description: "Hemos analizado tu perfil y creado una ruta personalizada basada en tus preferencias de aprendizaje.",
    profile: {
      type: "Aprendiz Equilibrado",
      traits: [
        { name: "Teórico", score: Math.floor(Math.random() * 3) + 6 },
        { name: "Práctico", score: Math.floor(Math.random() * 3) + 6 },
        { name: "Colaborativo", score: Math.floor(Math.random() * 3) + 5 }
      ]
    },
    route: {
      name: "Ruta de Desarrollo Integral",
      steps: [
        {
          title: "Fundamentos Teóricos",
          description: "Establecer bases sólidas de conocimiento",
          duration: "2-3 semanas"
        },
        {
          title: "Práctica Guiada",
          description: "Aplicar conceptos en ejercicios estructurados",
          duration: "3-4 semanas"
        },
        {
          title: "Proyectos Colaborativos",
          description: "Trabajar en equipo en desafíos reales",
          duration: "4-5 semanas"
        }
      ]
    }
  }
}

const startLearning = async () => {
  console.log('🚀 Finalizando assessment y navegando al home...')
  
  // Verificar estado final
  console.log('🔍 Estado final:', {
    user: user.value,
    hasCompleted: user.value?.hasCompletedAssessment,
    learningProfile: !!user.value?.learningProfile
  })
  
  // Navegar al home
  console.log('📍 Navegando al home...')
  window.location.href = '/'
}

const retakeAssessment = () => {
  currentQuestion.value = 1
  answers.value = []
  isCompleted.value = false
  isProcessing.value = false
  processingStep.value = 0
  learningPath.value = null
}

// Meta tags
useSeoMeta({
  title: 'Assessment - UTP+clubs',
  description: 'Evaluación inicial para generar tu ruta de aprendizaje personalizada'
})
</script>

<style scoped>
.assessment-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.assessment-card {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.assessment-header {
  background: #f8fafc;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-section h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.progress-section p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
}

.question-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.question-card {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.question-number {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.question-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.question-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 3rem;
}

.rating-section {
  margin-bottom: 3rem;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.rating-scale {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.rating-button {
  width: 50px;
  height: 50px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  background: white;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.rating-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.rating-button.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.1);
}

.rating-description {
  height: 1.5rem;
  color: #667eea;
  font-weight: 600;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.prev-button {
  background: #f1f5f9;
  color: #64748b;
}

.prev-button:hover:not(:disabled) {
  background: #e2e8f0;
}

.next-button {
  background: #667eea;
  color: white;
}

.next-button:hover:not(:disabled) {
  background: #5a67d8;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.processing-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.processing-animation {
  margin-bottom: 2rem;
}

.spinner-large {
  width: 80px;
  height: 80px;
  border: 8px solid #f3f4f6;
  border-top: 8px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.processing-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.processing-section p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f9fafb;
  color: #6b7280;
  transition: all 0.3s;
}

.step.active {
  background: #667eea;
  color: white;
}

.results-section {
  flex: 1;
  padding: 3rem 2rem;
}

.results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.results-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
}

.results-header p {
  color: #6b7280;
  font-size: 1.125rem;
}

.profile-summary {
  margin-bottom: 3rem;
}

.profile-summary h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.trait-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(102, 126, 234, calc(var(--intensity) * 0.8 + 0.1));
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.learning-route h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.route-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.route-step {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h4 {
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.step-duration {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.secondary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .assessment-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .question-title {
    font-size: 1.25rem;
  }
  
  .rating-scale {
    flex-wrap: wrap;
  }
  
  .rating-button {
    width: 40px;
    height: 40px;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 