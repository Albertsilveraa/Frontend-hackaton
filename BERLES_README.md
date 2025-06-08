# 🎓 Berles - Asistente Educacional con RAG y Autenticación

## Descripción

Berles es un asistente educacional inteligente que utiliza tecnología RAG (Retrieval Augmented Generation) para proporcionar respuestas personalizadas sobre estudios. Combina la búsqueda en una base de conocimientos vectorial con un asistente de IA para ofrecer respuestas contextualmente relevantes.

**Características principales:**
- 🔐 **Autenticación segura** con credenciales UTP
- 🤖 **Agente RAG inteligente** con OpenAI y Qdrant
- 💬 **Interfaz de chat moderna** y responsiva
- 📚 **Respuestas educacionales personalizadas**
- 🛡️ **Fallbacks inteligentes** para garantizar respuestas útiles

## 🏗️ Arquitectura

- **Frontend**: Página Vue.js con interfaz de chat en tiempo real
- **Backend**: API REST de Nuxt con agente RAG
- **Base de datos vectorial**: Qdrant para almacenar embeddings de contenido educativo
- **IA**: OpenAI GPT para generar respuestas y crear embeddings
- **Autenticación**: Sistema de login estático integrado

## 🔐 Credenciales de Acceso

Para acceder a Berles, usa las siguientes credenciales:

- **Código UTP**: `U20200665`
- **Contraseña**: `72836921`

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Ya tienes tu archivo `.env` configurado con:

```bash
OPENAI_API_KEY=tu_clave_openai
ASSISTANT_ID=tu_assistant_id
QDRANT_URL=http://localhost:6333
COLLECTION_NAME=material_educativo
```

### 3. Configurar Qdrant (Opcional)

#### Opción A: Qdrant Local con Docker
```bash
docker run -p 6333:6333 qdrant/qdrant
```

#### Opción B: Usar Fallback
Si no tienes Qdrant configurado, el sistema usará contenido educativo de ejemplo.

## 🔄 Ejecución

### Desarrollo

```bash
npm run dev
```

Luego navega a:
- **Login**: `http://localhost:3000/login`
- **Berles**: `http://localhost:3000/berles` (requiere autenticación)

## 🌐 Flujo de Uso

1. **Login**: Accede con las credenciales UTP
2. **Berles**: Chatea con el asistente educacional
3. **Logout**: Cierra sesión cuando termines

## 🔧 Estructura de Archivos

```
app/
├── pages/
│   ├── login.vue                  # Página de autenticación
│   └── berles.vue                 # Chat del asistente
├── middleware/
│   └── auth.ts                    # Middleware de autenticación
├── composables/
│   └── useAuth.ts                 # Gestión de autenticación
server/
└── api/
    └── rag-agent.ts              # API REST del agente RAG
```

## 🎯 Funcionalidades

### ✅ **Implementado**

- ✅ **Login con credenciales UTP**
- ✅ **Protección de rutas con middleware**
- ✅ **Chat en tiempo real con API REST**
- ✅ **Agente RAG con OpenAI y Qdrant**
- ✅ **Fallbacks educacionales inteligentes**
- ✅ **Interfaz responsiva y moderna**
- ✅ **Gestión de sesiones con localStorage**

### 🚀 **Características del Agente**

- **Búsqueda semántica** en base de conocimientos
- **Respuestas contextualizadas** con RAG
- **Fallbacks inteligentes** si no hay conexión a Qdrant
- **Consejos educacionales** especializados por tema:
  - 📚 Técnicas de estudio
  - 💪 Motivación estudiantil  
  - 📋 Preparación para exámenes
  - 🧠 Organización y planificación

## 🚨 Solución de Problemas

### Error de Autenticación
- Verifica las credenciales: `U20200665` / `72836921`
- Limpia localStorage si hay problemas de sesión

### Error de API
- El sistema tiene fallbacks educacionales automáticos
- Verifica tu API key de OpenAI en `.env`

### Sin Qdrant
- ¡No hay problema! El sistema funciona con contenido de ejemplo
- Para usar RAG completo, configura Qdrant según las instrucciones

## 📊 Poblando la Base de Datos (Opcional)

Si quieres usar RAG completo con tu propio contenido:

```python
import openai
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
import uuid

openai.api_key = "tu_openai_api_key"
client = QdrantClient("http://localhost:6333")

def add_educational_content(text, title, subject=None):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    
    embedding = response.data[0].embedding
    
    client.upsert(
        collection_name="material_educativo",
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": text,
                    "title": title,
                    "subject": subject
                }
            )
        ]
    )
```

## 🎨 Personalización

### Cambiar Credenciales
Edita `app/composables/useAuth.ts`:

```typescript
const VALID_CREDENTIALS = {
  codigo: 'TU_CODIGO',
  password: 'TU_PASSWORD'
}
```

### Personalizar Fallbacks
Edita las respuestas en `app/pages/berles.vue` en la función `sendMessage()`.

## 🔮 Próximas Características

- [ ] Múltiples usuarios
- [ ] Historial de conversaciones
- [ ] Themes personalizables  
- [ ] Integración con calendarios académicos
- [ ] Notificaciones push
- [ ] Analytics de uso

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Disfruta usando Berles! 🎓✨** 