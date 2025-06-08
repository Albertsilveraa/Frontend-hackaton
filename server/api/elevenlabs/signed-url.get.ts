export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Verificar que tenemos las credenciales necesarias
  if (!config.elevenLabsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ElevenLabs API key no configurada'
    })
  }

  const agentId = config.public.ELEVENLABS_AGENT_ID
  if (!agentId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ElevenLabs Agent ID no configurado'
    })
  }

  try {
    // Obtener URL firmada de ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': config.elevenLabsApiKey,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de ElevenLabs:', response.status, errorText)
      
      throw createError({
        statusCode: response.status,
        statusMessage: `Error de ElevenLabs: ${response.statusText}`
      })
    }

    const data = await response.json()
    
    return {
      signedUrl: data.signed_url,
      agentId: agentId
    }
    
  } catch (error) {
    console.error('Error obteniendo URL firmada de ElevenLabs:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al conectar con ElevenLabs'
    })
  }
}) 