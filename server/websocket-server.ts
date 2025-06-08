import { createServer } from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

// 🧠 CONFIG
const PORT = parseInt(process.env.WS_PORT || "8080");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 🧰 UTILS
function findText(obj: any): string {
  if (typeof obj === "string") {
    try {
      return findText(JSON.parse(obj));
    } catch {
      return obj;
    }
  }
  if (typeof obj !== "object" || obj === null) return "";
  for (const key of ["payload", "text", "body", "mensaje", "query"]) {
    if (key in obj) {
      return findText(obj[key]);
    }
  }
  return "";
}

// 💾 Thread Management (in-memory for simplicity, use Redis/DB in production)
const userThreads = new Map<string, string>();

async function getOrCreateThread(userId: string): Promise<string> {
  if (userThreads.has(userId)) {
    const threadId = userThreads.get(userId)!;
    try {
      await openai.beta.threads.retrieve(threadId);
      return threadId;
    } catch {
      // Thread doesn't exist, create new one
    }
  }
  
  const newThread = await openai.beta.threads.create();
  userThreads.set(userId, newThread.id);
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
      
      const result = await this.client.search(process.env.COLLECTION_NAME || "educational_content", {
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
    const threadId = await getOrCreateThread(userId);
    
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
- Mantén un tono profesional pero amigable`;

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

// 🛰️ Servidor WebSocket
const server = createServer();
const wss = new WebSocketServer({ server });

let agent: EducationalAgent;

// Inicializar agente
(async () => {
  try {
    console.log("🔄 Inicializando agente educacional...");
    const retriever = new EducationalRetriever();
    agent = new EducationalAgent(retriever);
    console.log("✅ Agente educacional inicializado correctamente");
  } catch (error) {
    console.error("❌ Error inicializando agente:", error);
    process.exit(1);
  }
})();

wss.on("connection", (ws) => {
  console.log("🟢 Cliente conectado al agente educacional");

  // Enviar mensaje de bienvenida
  ws.send(JSON.stringify({
    event: "welcome",
    payload: { respuesta: "🎓 Bienvenido a Berles. Pregunta sobre estudios y obtén respuestas personalizadas usando IA y recuperación de documentos." },
    from: "sistema",
    chatID: "sistema"
  }));

  ws.on("message", async (msg) => {
    try {
      const datos = JSON.parse(msg.toString());
      const chatId = datos.chatID || "anon";
      const consulta = findText(datos.payload || datos);

      console.log(`📚 Consulta de ${chatId}: ${consulta}`);
      
      if (!consulta.trim()) {
        ws.send(JSON.stringify({
          event: "error",
          payload: { respuesta: "❓ Por favor, escribe una pregunta válida." },
          from: "sistema",
          chatID: chatId
        }));
        return;
      }
      
      // Procesar consulta con RAG
      const respuesta = await agent.handleQuery(consulta, chatId);
      
      // Enviar respuesta
      ws.send(JSON.stringify({
        event: "message",
        payload: { respuesta },
        from: chatId,
        chatID: chatId
      }));
      
    } catch (error) {
      console.error("❌ Error procesando mensaje WebSocket:", error);
      
      ws.send(JSON.stringify({
        event: "error",
        payload: { respuesta: "❌ Error procesando tu consulta. Inténtalo de nuevo." },
        from: "sistema",
        chatID: "sistema"
      }));
    }
  });

  ws.on("close", () => {
    console.log("🔴 Cliente desconectado del agente educacional");
  });
  
  ws.on("error", (error) => {
    console.error("❌ Error WebSocket:", error);
  });
});

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  wss.close(() => {
    console.log('✅ Servidor WebSocket cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  wss.close(() => {
    console.log('✅ Servidor WebSocket cerrado correctamente');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor WebSocket del agente educacional activo en ws://localhost:${PORT}`);
  console.log(`📋 Variables de entorno requeridas:`);
  console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   - QDRANT_URL: ${process.env.QDRANT_URL || 'http://localhost:6333 (default)'}`);
  console.log(`   - COLLECTION_NAME: ${process.env.COLLECTION_NAME || 'educational_content (default)'}`);
  console.log(`   - ASSISTANT_ID: ${process.env.ASSISTANT_ID ? '✅ Configurado' : '⚠️ No configurado (usando ChatCompletion como fallback)'}`);
}); 