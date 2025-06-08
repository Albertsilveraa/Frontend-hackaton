// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-01',

  // Configuración de runtime para incluir variables de ElevenLabs
  runtimeConfig: {
    // Variables privadas del servidor
    openaiApiKey: process.env.OPENAI_API_KEY,
    qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
    collectionName: process.env.COLLECTION_NAME || 'material_educativo',
    assistantId: process.env.ASSISTANT_ID,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    
    // Variables públicas del cliente (accesibles desde el frontend)
    public: {
      ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID,
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY
    }
  },

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
