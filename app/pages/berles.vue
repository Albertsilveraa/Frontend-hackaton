<script setup lang="ts">
import VoiceDisc from '@/components/berles/VoiceDisc.vue'
import { useAuth } from '@/composables'

// Middleware de autenticación
definePageMeta({ middleware: 'auth', layout: 'dashboard' })

interface ChatMessage {
  text: string
  from: 'user' | 'bot'
  timestamp: Date
}

const { user, logout } = useAuth()
const messages = ref<ChatMessage[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const currentMode = ref<'text' | 'voice'>('text')

onMounted(() => {
  // Mensaje de bienvenida solo para modo texto
  if (currentMode.value === 'text') {
    addMessage('🎓 Bienvenido a Berles. Pregunta sobre estudios y obtén respuestas personalizadas usando IA.', 'bot')
  }
})

// Watcher para el cambio de modo
watch(currentMode, (newMode) => {
  if (newMode === 'text' && messages.value.length === 0) {
    addMessage('🎓 Bienvenido a Berles. Pregunta sobre estudios y obtén respuestas personalizadas usando IA.', 'bot')
  }
})

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) {
    return
  }

  const message = currentMessage.value.trim()
  addMessage(message, 'user')
  currentMessage.value = ''
  isLoading.value = true

  try {
    // Llamar a la API REST
    const { data } = await $fetch('/api/rag-agent', {
      method: 'POST',
      body: {
        query: message,
        userId: user.value?.codigo || 'anonymous'
      }
    }) as any

    if (data?.response) {
      addMessage(data.response, 'bot')
    } else {
      addMessage('❌ No se pudo obtener una respuesta válida.', 'bot')
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error)

    // Respuesta de fallback si hay error
    let fallbackResponse = ''

    if (message.toLowerCase().includes('estudio') || message.toLowerCase().includes('estudiar')) {
      fallbackResponse = `📚 **Consejos de estudio efectivo:**

• **Planifica tu tiempo**: Crea un horario de estudio realista
• **Ambiente adecuado**: Busca un lugar tranquilo y bien iluminado
• **Técnica Pomodoro**: 25 min de estudio + 5 min de descanso
• **Resúmenes activos**: Escribe con tus propias palabras
• **Mapas mentales**: Organiza la información visualmente
• **Enseña a otros**: Explica lo que aprendiste

¿Te gustaría que profundice en alguna de estas técnicas?`
    } else if (message.toLowerCase().includes('motivacion') || message.toLowerCase().includes('motivación')) {
      fallbackResponse = `💪 **Tips de motivación para estudiantes:**

• **Metas claras**: Define objetivos específicos y alcanzables
• **Celebra logros**: Reconoce tus pequeños avances
• **Visualiza el éxito**: Imagina el resultado que quieres alcanzar
• **Encuentra tu "por qué"**: Recuerda tus razones para estudiar
• **Conecta con compañeros**: Estudiar en grupo puede ser motivador
• **Cuida tu bienestar**: Duerme bien, come saludable y ejercítate

¡Recuerda que cada pequeño paso te acerca a tu meta! 🎯`
    } else if (message.toLowerCase().includes('examen') || message.toLowerCase().includes('exámenes')) {
      fallbackResponse = `📋 **Estrategias para exámenes exitosos:**

**Antes del examen:**
• Repasa material clave 2-3 días antes
• Practica con exámenes anteriores
• Prepara todo lo necesario la noche anterior

**Durante el examen:**
• Lee todas las instrucciones cuidadosamente
• Administra tu tiempo sabiamente
• Comienza con preguntas que sepas bien
• Revisa tus respuestas si tienes tiempo

**Control de nervios:**
• Respira profundamente
• Llega temprano para estar tranquilo
• Confía en tu preparación

¡Tú puedes! 💪`
    } else {
      fallbackResponse = `🤖 Disculpa, estoy teniendo problemas técnicos temporales.

**Mientras tanto, aquí tienes algunos recursos útiles:**

• **Técnicas de estudio**: Pomodoro, mapas mentales, resúmenes
• **Organización**: Calendarios, listas de tareas, planificación
• **Motivación**: Metas claras, recompensas, grupos de estudio
• **Bienestar**: Descanso, ejercicio, alimentación saludable

¿Hay algún tema específico sobre estudios en el que pueda ayudarte?`
    }

    addMessage(fallbackResponse, 'bot')
  } finally {
    isLoading.value = false
  }
}

const addMessage = (text: string, from: 'user' | 'bot') => {
  messages.value.push({
    text,
    from,
    timestamp: new Date()
  })

  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (text: string) => {
  // Formato mejorado para mejorar la presentación
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '<span style="color: #667eea;">•</span>')
    .replace(/(\d+\.)/g, '<strong style="color: #667eea;">$1</strong>')
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = () => {
  logout()
}

// Meta tags
useSeoMeta({
  title: 'Berles - Asistente Educacional',
  description: 'Interactúa con nuestro agente educacional impulsado por IA para obtener respuestas personalizadas sobre estudios.'
})
</script>

<template>
  <div class="berles-container">
    <!-- Header con usuario y logout -->
    <div class="chat-header">
      <div class="header-content">
        <div class="user-info">
          <h1>🎓 Berles - Asistente Educacional</h1>
          <p>Pregunta sobre estudios y obtén respuestas personalizadas</p>
        </div>
        <div class="user-actions">
          <div class="user-badge">
            <Icon name="lucide:user" />
            <span>{{ user?.codigo }}</span>
          </div>
          <button
            class="logout-button"
            @click="handleLogout"
          >
            <Icon name="lucide:log-out" />
            Salir
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs para alternar entre modos -->
    <div class="mode-tabs">
      <button
        :class="['tab', { active: currentMode === 'text' }]"
        @click="currentMode = 'text'"
      >
        <Icon name="lucide:message-circle" />
        Chat de Texto
      </button>
      <button
        :class="['tab', { active: currentMode === 'voice' }]"
        @click="currentMode = 'voice'"
      >
        <Icon name="lucide:mic" />
        Conversación de Voz
      </button>
    </div>

    <!-- Modo Texto -->
    <div
      v-if="currentMode === 'text'"
      class="chat-container"
    >
      <div
        ref="messagesContainer"
        class="messages-container"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.from === 'user' ? 'user-message' : 'bot-message']"
        >
          <div class="message-content">
            <div
              class="message-text"
              v-html="formatMessage(message.text)"
            />
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="message bot-message"
        >
          <div class="message-content">
            <div class="message-text">
              <div class="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <input
            v-model="currentMessage"
            :disabled="isLoading"
            placeholder="Escribe tu pregunta sobre estudios..."
            class="message-input"
            @keyup.enter="sendMessage"
          >
          <button
            :disabled="isLoading || !currentMessage.trim()"
            class="send-button"
            @click="sendMessage"
          >
            <Icon name="lucide:send" />
          </button>
        </div>
        <div class="api-status">
          <span class="status-indicator online" />
          API REST activa
        </div>
      </div>
    </div>

    <!-- Modo Voz -->
    <div
      v-else
      class="voice-container"
    >
      <div class="voice-header">
        <h2>🎤 Conversación de Voz con Berles</h2>
        <p>Habla directamente con tu asistente educacional usando IA conversacional</p>
      </div>

      <VoiceDisc />

      <div class="voice-info">
        <div class="info-card">
          <Icon name="lucide:zap" />
          <h3>Conversación Natural</h3>
          <p>Habla de forma natural como si fuera una conversación real</p>
        </div>
        <div class="info-card">
          <Icon name="lucide:brain" />
          <h3>IA Avanzada</h3>
          <p>Powered by ElevenLabs para una experiencia conversacional única</p>
        </div>
        <div class="info-card">
          <Icon name="lucide:graduation-cap" />
          <h3>Especializado en Educación</h3>
          <p>Optimizado para consultas académicas y consejos de estudio</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.berles-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.chat-header {
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.user-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.user-info p {
  margin: 0;
  opacity: 0.9;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #64748b;
}

.tab:hover {
  background: #e2e8f0;
  color: #475569;
}

.tab.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.voice-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.voice-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
}

.voice-header h2 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-weight: 700;
}

.voice-header p {
  margin: 0;
  color: #6b7280;
}

.voice-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: #f8fafc;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.info-card svg {
  width: 2rem;
  height: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.info-card h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f8fafc;
}

.message {
  margin-bottom: 1rem;
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.user-message .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-message .message-content {
  background: white;
  color: #333;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.input-container {
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.send-button {
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: #5a67d8;
}

.send-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.api-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.online {
  background: #10b981;
}

@media (max-width: 768px) {
  .berles-container {
    padding: 0.5rem;
    height: 100vh;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .user-info h1 {
    font-size: 1.5rem;
  }

  .user-actions {
    justify-content: center;
  }

  .message-content {
    max-width: 85%;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .send-button {
    align-self: flex-end;
    width: auto;
  }

  .voice-info {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .mode-tabs {
    flex-direction: column;
  }
}
</style>
