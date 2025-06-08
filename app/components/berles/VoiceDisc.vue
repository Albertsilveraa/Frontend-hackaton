<template>
  <div class="voice-disc-container">
    <!-- Estado de configuración -->
    <div v-if="!elevenLabs.isConfigured.value" class="config-warning">
      <Icon name="lucide:alert-triangle" />
      <p>ElevenLabs no está configurado correctamente</p>
      <p class="config-help">Verifica las variables ELEVENLABS_AGENT_ID y ELEVENLABS_API_KEY</p>
    </div>

    <!-- Disco principal -->
    <div v-else class="voice-disc-wrapper">
      <!-- Círculos de fondo animados -->
      <div class="background-circles">
        <div 
          v-for="i in 3" 
          :key="i"
          :class="['circle', `circle-${i}`, { 
            'recording': elevenLabs.state.isRecording,
            'playing': elevenLabs.state.isPlaying,
            'connecting': elevenLabs.state.isLoading
          }]"
        ></div>
      </div>

      <!-- Disco principal -->
      <div 
        :class="['voice-disc', {
          'connected': elevenLabs.state.isConnected,
          'recording': elevenLabs.state.isRecording,
          'playing': elevenLabs.state.isPlaying,
          'loading': elevenLabs.state.isLoading,
          'error': elevenLabs.state.error
        }]"
        @click="toggleRecording"
      >
        <!-- Icono central -->
        <div class="disc-icon">
          <Icon 
            v-if="elevenLabs.state.isLoading" 
            name="lucide:loader-2" 
            class="spinning"
          />
          <Icon 
            v-else-if="elevenLabs.state.error" 
            name="lucide:alert-circle" 
          />
          <Icon 
            v-else-if="elevenLabs.state.isRecording" 
            name="lucide:square" 
          />
          <Icon 
            v-else-if="elevenLabs.state.isPlaying" 
            name="lucide:volume-2" 
          />
          <Icon 
            v-else-if="elevenLabs.state.isConnected" 
            name="lucide:mic" 
          />
          <Icon 
            v-else 
            name="lucide:power" 
          />
        </div>

        <!-- Ondas de audio animadas -->
        <div v-if="elevenLabs.state.isRecording || elevenLabs.state.isPlaying" class="audio-waves">
          <div v-for="i in 8" :key="i" :class="['wave', `wave-${i}`]"></div>
        </div>
      </div>

      <!-- Indicador de estado -->
      <div class="status-indicator">
        <div :class="['status-dot', getStatusClass()]"></div>
        <span class="status-text">{{ getStatusText() }}</span>
      </div>

      <!-- Transcripción en tiempo real -->
      <div v-if="elevenLabs.state.isConnected" class="conversation-panel">
        <div class="conversation-header">
          <Icon name="lucide:message-square" />
          <h3>Conversación en Tiempo Real</h3>
        </div>
        
        <!-- Transcripción del usuario -->
        <div v-if="elevenLabs.state.transcript" class="transcript-section">
          <div class="transcript-label">
            <Icon name="lucide:user" />
            <span>Tú dijiste:</span>
          </div>
          <div class="transcript-text user-transcript">
            {{ elevenLabs.state.transcript }}
          </div>
        </div>

        <!-- Respuesta del agente -->
        <div v-if="elevenLabs.state.agentResponse" class="transcript-section">
          <div class="transcript-label">
            <Icon name="lucide:bot" />
            <span>Berles responde:</span>
          </div>
          <div class="transcript-text agent-response">
            {{ elevenLabs.state.agentResponse }}
          </div>
        </div>

        <!-- Indicador de estado de conversación -->
        <div v-if="!elevenLabs.state.transcript && !elevenLabs.state.agentResponse" class="conversation-idle">
          <Icon name="lucide:ear" />
          <p>Berles está listo para escucharte...</p>
          <div class="audio-status">
            <Icon name="lucide:volume-x" />
            <span>Conversación por texto (audio no disponible)</span>
          </div>
        </div>
      </div>

      <!-- Controles adicionales -->
      <div v-if="elevenLabs.state.isConnected" class="voice-controls">
        <!-- Control de volumen -->
        <div class="volume-control">
          <Icon name="lucide:volume-1" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            :value="elevenLabs.state.volume"
            @input="updateVolume"
            class="volume-slider"
          />
          <span class="volume-value">{{ Math.round(elevenLabs.state.volume * 100) }}%</span>
        </div>

        <!-- Botón de desconexión -->
        <button @click="disconnect" class="disconnect-btn">
          <Icon name="lucide:phone-off" />
          Desconectar
        </button>
      </div>

      <!-- Mensaje de error -->
      <div v-if="elevenLabs.state.error" class="error-message">
        <Icon name="lucide:alert-circle" />
        <p>{{ elevenLabs.state.error }}</p>
        <button @click="retry" class="retry-btn">
          <Icon name="lucide:refresh-cw" />
          Reintentar
        </button>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <div v-if="elevenLabs.state.error && elevenLabs.state.error.includes('Permisos')" class="instruction error">
          <Icon name="lucide:mic-off" />
          <span>{{ elevenLabs.state.error }}</span>
        </div>
        <div v-else-if="!elevenLabs.state.isConnected" class="instruction">
          <Icon name="lucide:power" />
          <span>Haz clic para conectar</span>
        </div>
        <div v-else-if="!elevenLabs.state.isRecording" class="instruction">
          <Icon name="lucide:mic" />
          <span>Haz clic para hablar</span>
        </div>
        <div v-else class="instruction recording">
          <Icon name="lucide:square" />
          <span>Haz clic para detener</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const elevenLabs = useElevenLabs()

// Alternar grabación
const toggleRecording = async () => {
  console.log('🔄 toggleRecording llamado')
  console.log('Estado actual:', {
    isConfigured: elevenLabs.isConfigured.value,
    isLoading: elevenLabs.state.isLoading,
    isConnected: elevenLabs.state.isConnected,
    isRecording: elevenLabs.state.isRecording
  })

  if (!elevenLabs.isConfigured.value) {
    console.warn('⚠️ ElevenLabs no configurado')
    return
  }

  if (elevenLabs.state.isLoading) {
    console.warn('⚠️ Ya está cargando, ignorando click')
    return
  }

  // Limpiar errores previos
  if (elevenLabs.state.error) {
    elevenLabs.state.error = null
  }

  try {
    if (!elevenLabs.state.isConnected) {
      console.log('🔌 Intentando conectar...')
      const connected = await elevenLabs.connect()
      if (!connected) {
        console.error('❌ No se pudo conectar')
        return
      }
      console.log('✅ Conectado exitosamente')
      return // Salir aquí para que el usuario haga clic nuevamente para grabar
    }

    if (elevenLabs.state.isRecording) {
      console.log('🛑 Deteniendo grabación...')
      elevenLabs.stopRecording()
    } else {
      console.log('▶️ Iniciando grabación...')
      const started = await elevenLabs.startRecording()
      if (!started) {
        console.error('❌ No se pudo iniciar la grabación')
      }
    }
  } catch (error) {
    console.error('❌ Error en toggleRecording:', error)
    elevenLabs.state.error = 'Error en la operación de voz'
  }
}

// Actualizar volumen
const updateVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  elevenLabs.setVolume(parseFloat(target.value))
}

// Desconectar
const disconnect = () => {
  elevenLabs.disconnect()
}

// Reintentar conexión
const retry = async () => {
  await elevenLabs.connect()
}

// Obtener clase de estado
const getStatusClass = () => {
  if (elevenLabs.state.error) return 'error'
  if (elevenLabs.state.isLoading) return 'loading'
  if (elevenLabs.state.isRecording) return 'recording'
  if (elevenLabs.state.isPlaying) return 'playing'
  if (elevenLabs.state.isConnected) return 'connected'
  return 'disconnected'
}

// Obtener texto de estado
const getStatusText = () => {
  if (elevenLabs.state.error) return 'Error'
  if (elevenLabs.state.isLoading) return 'Conectando...'
  if (elevenLabs.state.isRecording) return 'Escuchando'
  if (elevenLabs.state.isPlaying) return 'Reproduciendo'
  if (elevenLabs.state.isConnected) return 'Conectado'
  return 'Desconectado'
}
</script>

<style scoped>
.voice-disc-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 400px;
}

.config-warning {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  max-width: 400px;
}

.config-warning svg {
  width: 2rem;
  height: 2rem;
  margin-bottom: 1rem;
}

.config-help {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.voice-disc-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
}

.background-circles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: pulse 2s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  border-color: rgba(102, 126, 234, 0.2);
}

.circle-2 {
  width: 160px;
  height: 160px;
  top: -80px;
  left: -80px;
  border-color: rgba(102, 126, 234, 0.3);
  animation-delay: -0.5s;
}

.circle-3 {
  width: 120px;
  height: 120px;
  top: -60px;
  left: -60px;
  border-color: rgba(102, 126, 234, 0.4);
  animation-delay: -1s;
}

.circle.recording {
  border-color: rgba(239, 68, 68, 0.4);
  animation-duration: 1s;
}

.circle.playing {
  border-color: rgba(34, 197, 94, 0.4);
  animation-duration: 1.5s;
}

.circle.connecting {
  border-color: rgba(245, 158, 11, 0.4);
  animation-duration: 0.8s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

.voice-disc {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 3px solid #cbd5e0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.voice-disc:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.voice-disc.connected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.voice-disc.recording {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  color: white;
  animation: recordingPulse 1s ease-in-out infinite;
}

.voice-disc.playing {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: #22c55e;
  color: white;
  animation: playingPulse 1.5s ease-in-out infinite;
}

.voice-disc.loading {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
  color: white;
}

.voice-disc.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  color: white;
}

@keyframes recordingPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(239, 68, 68, 0.5);
  }
}

@keyframes playingPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(34, 197, 94, 0.5);
  }
}

.disc-icon {
  font-size: 2rem;
  z-index: 2;
  position: relative;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.audio-waves {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
}

.wave {
  width: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}

.wave-1 { height: 10px; animation-delay: 0s; }
.wave-2 { height: 15px; animation-delay: 0.1s; }
.wave-3 { height: 20px; animation-delay: 0.2s; }
.wave-4 { height: 25px; animation-delay: 0.3s; }
.wave-5 { height: 20px; animation-delay: 0.4s; }
.wave-6 { height: 15px; animation-delay: 0.5s; }
.wave-7 { height: 10px; animation-delay: 0.6s; }
.wave-8 { height: 5px; animation-delay: 0.7s; }

@keyframes wave {
  0%, 100% {
    height: 5px;
    opacity: 0.5;
  }
  50% {
    height: 25px;
    opacity: 1;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.status-dot.disconnected { background: #94a3b8; }
.status-dot.connecting { background: #f59e0b; animation: blink 1s infinite; }
.status-dot.connected { background: #22c55e; }
.status-dot.recording { background: #ef4444; animation: blink 0.5s infinite; }
.status-dot.playing { background: #22c55e; animation: blink 0.8s infinite; }
.status-dot.error { background: #ef4444; }
.status-dot.loading { background: #f59e0b; animation: blink 1s infinite; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.conversation-panel {
  width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.conversation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #667eea;
  color: white;
}

.conversation-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.transcript-section {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.transcript-section:last-child {
  border-bottom: none;
}

.transcript-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.transcript-text {
  padding: 0.75rem;
  border-radius: 8px;
  line-height: 1.5;
  font-size: 0.875rem;
}

.user-transcript {
  background: #dbeafe;
  color: #1e3a8a;
  border-left: 3px solid #3b82f6;
}

.agent-response {
  background: #d1fae5;
  color: #065f46;
  border-left: 3px solid #10b981;
}

.conversation-idle {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.conversation-idle svg {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.conversation-idle p {
  margin: 0;
  font-style: italic;
}

.audio-status {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
  color: #f59e0b;
}

.voice-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 100%;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.volume-value {
  font-size: 0.75rem;
  color: #64748b;
  min-width: 35px;
  text-align: right;
}

.disconnect-btn, .retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.disconnect-btn:hover, .retry-btn:hover {
  background: #dc2626;
}

.retry-btn {
  background: #667eea;
}

.retry-btn:hover {
  background: #5a67d8;
}

.error-message {
  text-align: center;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  width: 100%;
}

.error-message svg {
  margin-bottom: 0.5rem;
}

.instructions {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
}

.instruction {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.instruction.recording {
  color: #ef4444;
  font-weight: 500;
}

.instruction.error {
  color: #dc2626;
  font-weight: 600;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  max-width: 400px;
  text-align: center;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .voice-disc-container {
    padding: 1rem;
  }
  
  .voice-disc {
    width: 100px;
    height: 100px;
  }
  
  .disc-icon {
    font-size: 1.5rem;
  }
  
  .voice-disc-wrapper {
    max-width: 100%;
  }
}
</style> 