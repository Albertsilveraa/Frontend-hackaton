export interface ElevenLabsConfig {
  agentId: string
  hasApiKey: boolean
}

export interface ConversationState {
  isConnected: boolean
  isRecording: boolean
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  volume: number
  transcript: string
  agentResponse: string
}

export const useElevenLabs = () => {
  const config = useRuntimeConfig()
  
  // Estado reactivo
  const state = reactive<ConversationState>({
    isConnected: false,
    isRecording: false,
    isPlaying: false,
    isLoading: false,
    error: null,
    volume: 0.8,
    transcript: '',
    agentResponse: ''
  })

  // Referencias para WebSocket y streams de audio
  const websocket = ref<WebSocket | null>(null)
  const audioContext = ref<AudioContext | null>(null)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioQueue = ref<string[]>([])
  const isPlayingAudio = ref(false)

  // Configuración de ElevenLabs (solo verificamos que existan las variables)
  const elevenLabsConfig: ElevenLabsConfig = {
    agentId: config.public.ELEVENLABS_AGENT_ID || '',
    hasApiKey: !!(config.public.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY)
  }

  // Verificar configuración
  const isConfigured = computed(() => {
    return !!(elevenLabsConfig.agentId && elevenLabsConfig.hasApiKey)
  })

  // Inicializar contexto de audio
  const initAudioContext = async () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }
  }

  // Obtener URL firmada del servidor
  const getSignedUrl = async (): Promise<string> => {
    try {
      const response = await $fetch('/api/elevenlabs/signed-url')
      return response.signedUrl
    } catch (error) {
      console.error('Error obteniendo URL firmada:', error)
      // Fallback: usar URL directa con agent_id (menos seguro pero funcional)
      return `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${elevenLabsConfig.agentId}`
    }
  }

  // Conectar a ElevenLabs WebSocket
  const connect = async (): Promise<boolean> => {
    if (!isConfigured.value) {
      state.error = 'ElevenLabs no está configurado correctamente'
      return false
    }

    try {
      state.isLoading = true
      state.error = null

      await initAudioContext()

      // Obtener URL firmada para mayor seguridad
      const wsUrl = await getSignedUrl()
      
      websocket.value = new WebSocket(wsUrl)
      
      websocket.value.onopen = () => {
        console.log('🎤 Conectado a ElevenLabs')
        state.isConnected = true
        state.isLoading = false
        
        // Enviar configuración inicial más simple según la documentación
        const initMessage = {
          type: "conversation_initiation_client_data"
        }
        
        console.log('📤 Enviando configuración inicial:', initMessage)
        websocket.value?.send(JSON.stringify(initMessage))
      }

      websocket.value.onmessage = (event) => {
        console.log('📨 Mensaje recibido:', event.data)
        handleWebSocketMessage(event)
      }

      websocket.value.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error)
        state.error = 'Error de conexión con ElevenLabs'
        state.isConnected = false
        state.isLoading = false
      }

      websocket.value.onclose = (event) => {
        console.log('🔌 Desconectado de ElevenLabs')
        console.log('🔍 Detalles de cierre:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        })
        state.isConnected = false
        state.isLoading = false
        cleanup()
      }

      return true
    } catch (error) {
      console.error('❌ Error conectando a ElevenLabs:', error)
      state.error = 'No se pudo conectar a ElevenLabs'
      state.isLoading = false
      return false
    }
  }

  // Manejar mensajes del WebSocket según documentación oficial
  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'conversation_initiation_metadata':
          console.log('🎯 Conversación iniciada:', data)
          break
          
        case 'user_transcript':
          if (data.user_transcription_event) {
            state.transcript = data.user_transcription_event.user_transcript
            console.log('👤 Usuario dijo:', state.transcript)
          }
          break
          
        case 'agent_response':
          if (data.agent_response_event) {
            state.agentResponse = data.agent_response_event.agent_response
            console.log('🤖 Berles responde:', state.agentResponse)
          }
          break
          
        case 'audio':
          // Reproducir audio recibido
          if (data.audio_event) {
            console.log('🎵 Audio recibido, tamaño base64:', data.audio_event.audio_base_64.length)
            queueAudio(data.audio_event.audio_base_64)
          }
          break
          
        case 'ping':
          // Responder a ping para mantener conexión
          if (data.ping_event) {
            setTimeout(() => {
              websocket.value?.send(JSON.stringify({
                type: "pong",
                event_id: data.ping_event.event_id
              }))
            }, data.ping_event.ping_ms || 0)
          }
          break
          
        case 'interruption':
          console.log('⏸️ Interrupción detectada:', data.interruption_event?.reason)
          break
          
        default:
          console.log('📦 Mensaje recibido:', data)
      }
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error)
    }
  }

  // Queue de audio para reproducción secuencial
  const queueAudio = (audioBase64: string) => {
    audioQueue.value.push(audioBase64)
    if (!isPlayingAudio.value) {
      playNextAudio()
    }
  }

  // Reproducir siguiente audio en queue
  const playNextAudio = async () => {
    if (audioQueue.value.length === 0) {
      isPlayingAudio.value = false
      state.isPlaying = false
      console.log('🔚 Cola de audio vacía, finalizando reproducción')
      return
    }

    isPlayingAudio.value = true
    state.isPlaying = true

    const audioBase64 = audioQueue.value.shift()
    if (audioBase64) {
      try {
        await playAudioChunk(audioBase64)
      } catch (error) {
        console.log('⚠️ Error reproduciendo chunk de audio, continuando con el siguiente')
      }
    }

    // Continuar con el siguiente audio después de un pequeño delay
    setTimeout(() => {
      playNextAudio()
    }, 50) // Reducido de 100ms a 50ms para mejor fluidez
  }

  // Reproducir chunk de audio
  const playAudioChunk = async (audioBase64: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!audioContext.value) {
          console.log('⚠️ AudioContext no disponible, saltando audio')
          resolve()
          return
        }

        // Decodificar base64 a ArrayBuffer
        const binaryString = atob(audioBase64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        console.log('🎵 Decodificando audio, tamaño:', bytes.length, 'bytes')

        // Intentar decodificar como PCM (formato común de ElevenLabs)
        try {
          // Para PCM 16kHz mono, crear AudioBuffer directamente
          if (bytes.length > 0 && bytes.length % 2 === 0) {
            const sampleRate = 16000 // ElevenLabs usa 16kHz típicamente
            const numberOfChannels = 1 // Mono
            const length = bytes.length / 2 // 16-bit samples
            
            const audioBuffer = audioContext.value.createBuffer(numberOfChannels, length, sampleRate)
            const channelData = audioBuffer.getChannelData(0)
            
            // Convertir bytes a float32 para AudioBuffer
            for (let i = 0; i < length; i++) {
              const sample = (bytes[i * 2] | (bytes[i * 2 + 1] << 8))
              // Convertir de signed 16-bit a float32 (-1.0 to 1.0)
              channelData[i] = sample < 32768 ? sample / 32768 : (sample - 65536) / 32768
            }
            
            const source = audioContext.value.createBufferSource()
            const gainNode = audioContext.value.createGain()
            
            source.buffer = audioBuffer
            gainNode.gain.value = state.volume
            
            source.connect(gainNode)
            gainNode.connect(audioContext.value.destination)
            
            source.onended = () => {
              console.log('🔚 Audio PCM terminó de reproducirse')
              resolve()
            }
            
            source.start()
            console.log('▶️ Reproduciendo audio PCM...')
            return
          }
        } catch (pcmError) {
          console.log('⚠️ No es PCM válido, intentando otros formatos...')
        }

        // Fallback: intentar decodificar como formato estándar
        audioContext.value.decodeAudioData(bytes.buffer.slice())
          .then(audioBuffer => {
            console.log('✅ Audio decodificado exitosamente')
            const source = audioContext.value!.createBufferSource()
            const gainNode = audioContext.value!.createGain()
            
            source.buffer = audioBuffer
            gainNode.gain.value = state.volume
            
            source.connect(gainNode)
            gainNode.connect(audioContext.value!.destination)
            
            source.onended = () => {
              console.log('🔚 Audio terminó de reproducirse')
              resolve()
            }
            
            source.start()
            console.log('▶️ Reproduciendo audio...')
          })
          .catch(error => {
            console.log('⚠️ Formato de audio no soportado, continuando sin audio')
            console.log('💬 La conversación continuará solo con texto')
            resolve() // Continuar sin audio
          })
        
      } catch (error) {
        console.log('⚠️ Error general en audio, continuando sin reproducción')
        resolve() // Continuar sin audio
      }
    })
  }

  // Iniciar grabación
  const startRecording = async (): Promise<boolean> => {
    try {
      console.log('🎤 Iniciando grabación...')
      
      if (!state.isConnected) {
        console.log('⚠️ No conectado, intentando conectar primero...')
        const connected = await connect()
        if (!connected) {
          console.error('❌ No se pudo conectar antes de grabar')
          return false
        }
      }

      console.log('🎤 Solicitando permisos de micrófono...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })

      console.log('✅ Permisos de micrófono obtenidos')

      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        console.warn('⚠️ audio/webm;codecs=opus no soportado, usando formato por defecto')
        mediaRecorder.value = new MediaRecorder(stream)
      } else {
        mediaRecorder.value = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        })
      }

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0 && websocket.value?.readyState === WebSocket.OPEN) {
          // Convertir audio a base64 según formato esperado por ElevenLabs
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(',')[1]
            if (websocket.value?.readyState === WebSocket.OPEN) {
              websocket.value.send(JSON.stringify({
                user_audio_chunk: base64Audio
              }))
            }
          }
          reader.readAsDataURL(event.data)
        }
      }

      mediaRecorder.value.onerror = (event) => {
        console.error('❌ Error en MediaRecorder:', event)
        state.error = 'Error en la grabación'
        stopRecording()
      }

      mediaRecorder.value.onstop = () => {
        console.log('🛑 MediaRecorder detenido')
      }

      mediaRecorder.value.onstart = () => {
        console.log('▶️ MediaRecorder iniciado')
      }

      mediaRecorder.value.start(100) // Enviar chunks cada 100ms
      state.isRecording = true
      state.transcript = ''
      state.agentResponse = ''
      
      console.log('✅ Grabación iniciada exitosamente')
      return true
    } catch (error) {
      console.error('❌ Error iniciando grabación:', error)
      
      // Manejo específico de errores de permisos
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            state.error = 'Permisos de micrófono denegados. Por favor, permite el acceso al micrófono y recarga la página.'
            break
          case 'NotFoundError':
            state.error = 'No se encontró micrófono. Verifica que tengas un micrófono conectado.'
            break
          case 'NotReadableError':
            state.error = 'El micrófono está siendo usado por otra aplicación.'
            break
          case 'OverconstrainedError':
            state.error = 'La configuración del micrófono no es compatible.'
            break
          default:
            state.error = `Error de micrófono: ${error.message}`
        }
      } else {
        state.error = 'No se pudo acceder al micrófono'
      }
      
      return false
    }
  }

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorder.value && state.isRecording) {
      mediaRecorder.value.stop()
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop())
      mediaRecorder.value = null
      state.isRecording = false
    }
  }

  // Desconectar
  const disconnect = () => {
    stopRecording()
    
    if (websocket.value) {
      websocket.value.close()
      websocket.value = null
    }
    
    cleanup()
  }

  // Limpiar recursos
  const cleanup = () => {
    stopRecording()
    
    audioQueue.value = []
    isPlayingAudio.value = false
    
    if (audioContext.value) {
      audioContext.value.close()
      audioContext.value = null
    }
    
    state.isConnected = false
    state.isRecording = false
    state.isPlaying = false
    state.error = null
    state.transcript = ''
    state.agentResponse = ''
  }

  // Controlar volumen
  const setVolume = (volume: number) => {
    state.volume = Math.max(0, Math.min(1, volume))
  }

  // Limpiar al desmontar
  onUnmounted(() => {
    cleanup()
  })

  return {
    state: readonly(state),
    isConfigured,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    setVolume,
    cleanup
  }
} 