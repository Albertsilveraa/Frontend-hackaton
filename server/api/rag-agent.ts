import dotenv from "dotenv";
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

// 🧠 CONFIG
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 💾 Thread Management (in-memory for simplicity, use Redis/DB in production)
const userThreads = new Map<string, string>();

async function getOrCreateThread(userId: string): Promise<string> {
  // Asegurar que userId sea un string válido
  const cleanUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
  
  if (userThreads.has(cleanUserId)) {
    const threadId = userThreads.get(cleanUserId)!;
    try {
      await openai.beta.threads.retrieve(threadId);
      return threadId;
    } catch {
      // Thread doesn't exist, create new one
      console.log(`🔄 Thread ${threadId} no existe, creando uno nuevo para ${cleanUserId}`);
    }
  }
  
  const newThread = await openai.beta.threads.create();
  userThreads.set(cleanUserId, newThread.id);
  console.log(`✅ Nuevo thread creado: ${newThread.id} para usuario ${cleanUserId}`);
  return newThread.id;
}

// 🔍 RAG Retriever
class EducationalRetriever {
  private client: QdrantClient;
  
  constructor() {
    this.client = new QdrantClient({ url: process.env.QDRANT_URL || "http://localhost:6333" });
  }
  
  async searchContent(query: string, k = 5): Promise<any[]> {
    try {
      // Generar embedding para la consulta
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });
      
      const queryEmbedding = embeddingResponse.data[0].embedding;
      
      const result = await this.client.search(process.env.COLLECTION_NAME || "material_educativo", {
        vector: queryEmbedding,
        top: k,
        with_payload: true
      });
      
      return result;
    } catch (e) {
      console.error("❌ Error en búsqueda RAG:", e);
      // Retornar contenido de ejemplo si falla la búsqueda
      return [
        {
          payload: {
            text: "Información educativa general: Es importante establecer rutinas de estudio efectivas y utilizar técnicas de aprendizaje activo.",
            title: "Técnicas de Estudio"
          },
          score: 0.8
        }
      ];
    }
  }
}

// 🤖 EducationalAgent
class EducationalAgent {
  constructor(private retriever: EducationalRetriever) {}

  async handleQuery(query: string, userId: string): Promise<string> {
    try {
      // Buscar contenido relevante usando RAG
      const relevantDocs = await this.retriever.searchContent(query);
      
      // Si tenemos un assistant_id configurado, usar OpenAI Assistant
      if (process.env.ASSISTANT_ID) {
        return await this.handleWithAssistant(query, userId, relevantDocs);
      } else {
        // Fallback: usar chat completion con contexto RAG
        return await this.handleWithChatCompletion(query, relevantDocs);
      }
      
    } catch (e) {
      console.error("❌ Error en EducationalAgent:", e);
      return `❌ Error procesando tu consulta: ${e.message}`;
    }
  }
  
  private async handleWithAssistant(query: string, userId: string, relevantDocs: any[]): Promise<string> {
    try {
      const threadId = await getOrCreateThread(userId);
      console.log(`🧵 Usando thread: ${threadId} para usuario: ${userId}`);
      
      // Construir contexto con los documentos encontrados
      let context = "";
      if (relevantDocs.length > 0) {
        context = "\n\nContexto relevante de los estudios:\n";
        relevantDocs.forEach((doc, index) => {
          context += `${index + 1}. ${doc.payload?.text || doc.payload?.content || 'Información no disponible'}\n`;
        });
      }
      
      // Crear mensaje con contexto RAG
      const enrichedQuery = `${query}${context}`;
      
      // Asegurar que threadId sea string
      if (typeof threadId !== 'string') {
        throw new Error('Invalid thread_id type');
      }
      
      await openai.beta.threads.messages.create({
        thread_id: threadId,
        role: "user",
        content: enrichedQuery
      });

      let run = await openai.beta.threads.runs.create({
        thread_id: threadId,
        assistant_id: process.env.ASSISTANT_ID!
      });

      const timeout = Date.now() + 60000; // 60 segundos timeout
      while (!["completed", "failed", "cancelled"].includes(run.status)) {
        if (Date.now() > timeout) {
          throw new Error("⏱️ Timeout esperando respuesta del asistente");
        }
        await new Promise((r) => setTimeout(r, 1000));
        run = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      if (run.status === "failed") {
        throw new Error("❌ El asistente falló al procesar la consulta");
      }

      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];
      
      if (lastMessage?.content[0]?.type === 'text') {
        return lastMessage.content[0].text.value;
      }
      
      return "❓ No se pudo obtener una respuesta válida.";
    } catch (error) {
      console.error(`❌ Error en handleWithAssistant para usuario ${userId}:`, error);
      // Fallback a chat completion si falla el assistant
      return await this.handleWithChatCompletion(query, relevantDocs);
    }
  }
  
  private async handleWithChatCompletion(query: string, relevantDocs: any[]): Promise<string> {
    // Construir contexto con los documentos encontrados
    let context = "Contexto educativo relevante:\n";
    if (relevantDocs.length > 0) {
      relevantDocs.forEach((doc, index) => {
        context += `${index + 1}. ${doc.payload?.text || doc.payload?.content || 'Información no disponible'}\n`;
      });
    } else {
      context += "No se encontró contexto específico para esta consulta.\n";
    }
    
    const systemPrompt = `Eres un asistente educacional especializado en ayudar a estudiantes. 
Tu objetivo es proporcionar respuestas útiles, precisas y motivadoras sobre temas de estudio.

Utiliza el siguiente contexto para enriquecer tus respuestas:

${context}

Instrucciones:
- Responde de manera clara y estructurada
- Incluye ejemplos prácticos cuando sea posible
- Sé motivador y positivo
- Si no tienes información específica, proporciona consejos generales útiles
- Mantén un tono profesional pero amigable
- Usa emojis apropiados para hacer la respuesta más atractiva`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    return response.choices[0]?.message?.content || "❓ No se pudo generar una respuesta.";
  }
}

// Singleton instances
let retriever: EducationalRetriever;
let agent: EducationalAgent;

// Initialize agent
const initializeAgent = async () => {
  if (!retriever) {
    retriever = new EducationalRetriever();
  }
  if (!agent) {
    agent = new EducationalAgent(retriever);
  }
};

// Export handler for Nuxt API
export default defineEventHandler(async (event) => {
  // Método POST para consultas del agente
  if (getMethod(event) === 'POST') {
    try {
      await initializeAgent();
      
      const body = await readBody(event);
      let { query, userId } = body;
      
      if (!query || !userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Query and userId are required'
        });
      }
      
      // Validar y limpiar userId
      if (typeof userId !== 'string') {
        userId = String(userId);
      }
      
      // Asegurar que userId sea válido (solo letras, números, guiones y guiones bajos)
      userId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      if (!userId || userId.length === 0) {
        userId = 'anonymous_user';
      }
      
      console.log(`📚 Consulta de ${userId}: ${query}`);
      
      const response = await agent.handleQuery(query, userId);
      
      return {
        success: true,
        data: {
          response,
          timestamp: new Date().toISOString(),
          userId
        }
      };
      
    } catch (error) {
      console.error('❌ Error en API RAG:', error);
      
      // Respuesta de fallback educativa
      const fallbackResponse = `🤖 Disculpa, tengo problemas técnicos temporales. 

**Consejos educativos generales:**
• **Organiza tu tiempo**: Usa técnicas como Pomodoro (25 min estudio + 5 min descanso)
• **Ambiente adecuado**: Encuentra un lugar tranquilo y bien iluminado
• **Técnicas activas**: Haz resúmenes, mapas mentales y enseña lo que aprendes
• **Descanso**: Duerme 7-8 horas para consolidar el aprendizaje
• **Ejercicio**: Mantén tu cuerpo activo para mejorar la concentración

¿Hay algún tema específico de estudio en el que pueda ayudarte? 📚`;
      
      return {
        success: true,
        data: {
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          userId: 'fallback'
        }
      };
    }
  }
  
  // GET endpoint para health check
  if (getMethod(event) === 'GET') {
    return {
      status: 'OK',
      message: 'Educational RAG Agent API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        'POST /api/rag-agent': 'Enviar consulta al agente educacional',
        'GET /api/rag-agent': 'Health check'
      }
    };
  }
  
  // Método no permitido
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
}); 