import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// 🧠 CONFIG
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface AssessmentAnswer {
  category: string;
  score: number;
}

interface LearningPath {
  description: string;
  profile: {
    type: string;
    traits: Array<{ name: string; score: number }>;
  };
  route: {
    name: string;
    steps: Array<{
      title: string;
      description: string;
      duration: string;
    }>;
  };
}

class LearningPathGenerator {
  
  async generatePath(userId: string, answers: number[], categories: string[]): Promise<LearningPath> {
    try {
      // Procesar respuestas en categorías
      const processedAnswers = this.processAnswers(answers, categories);
      
      // Generar prompt para OpenAI
      const prompt = this.createAnalysisPrompt(userId, processedAnswers);
      
      // Llamar a OpenAI para generar el análisis
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Eres un experto en pedagogía y diseño de experiencias de aprendizaje. Tu tarea es analizar el perfil de aprendizaje de un estudiante y crear una ruta personalizada.

IMPORTANTE: Responde SOLO con un JSON válido sin texto adicional. El formato debe ser exactamente:

{
  "description": "string",
  "profile": {
    "type": "string",
    "traits": [{"name": "string", "score": number}]
  },
  "route": {
    "name": "string", 
    "steps": [{"title": "string", "description": "string", "duration": "string"}]
  }
}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      const learningPath = JSON.parse(content) as LearningPath;
      
      // Validar y asegurar que tenga la estructura correcta
      return this.validateAndEnhancePath(learningPath, processedAnswers);
      
    } catch (error) {
      console.error('Error generating learning path:', error);
      // Fallback path based on answers
      return this.generateFallbackPath(answers, categories);
    }
  }

  private processAnswers(answers: number[], categories: string[]): AssessmentAnswer[] {
    return categories.map((category, index) => ({
      category,
      score: answers[index] || 5
    }));
  }

  private createAnalysisPrompt(userId: string, answers: AssessmentAnswer[]): string {
    const answersText = answers.map(a => 
      `${a.category}: ${a.score}/9`
    ).join('\n');

    return `Analiza el siguiente perfil de aprendizaje del estudiante ${userId}:

RESPUESTAS DEL ASSESSMENT:
${answersText}

CATEGORÍAS EXPLICADAS:
- theoretical: Comodidad con conceptos teóricos complejos
- practical: Preferencia por ejercicios prácticos  
- collaborative: Gusto por trabajo en equipo
- discipline: Autodisciplina y organización
- competitive: Motivación por competencia académica
- multimedia: Preferencia por contenido multimedia vs texto
- depth: Importancia de entender el "por qué" profundo
- adaptability: Facilidad para adaptarse a nuevos métodos
- feedback: Necesidad de feedback constante

GENERA una ruta de aprendizaje personalizada que incluya:

1. DESCRIPTION: Una descripción personalizada del perfil (2-3 oraciones)
2. PROFILE TYPE: Un nombre descriptivo del tipo de aprendiz 
3. TRAITS: Los 3-4 rasgos más destacados con sus puntuaciones
4. ROUTE: Una ruta de 4-6 pasos progresivos con:
   - Títulos específicos y motivadores
   - Descripciones detalladas de cada paso
   - Duraciones realistas (ej: "2-3 semanas")

La ruta debe ser práctica, motivadora y adaptada a las fortalezas identificadas.`;
  }

  private validateAndEnhancePath(path: LearningPath, answers: AssessmentAnswer[]): LearningPath {
    // Asegurar que tenga estructura mínima
    if (!path.description) {
      path.description = "Hemos creado una ruta personalizada basada en tu perfil de aprendizaje.";
    }
    
    if (!path.profile?.type) {
      path.profile = { 
        type: "Aprendiz Personalizado", 
        traits: this.generateTraitsFromAnswers(answers) 
      };
    }

    if (!path.route?.steps || path.route.steps.length === 0) {
      path.route = {
        name: "Ruta de Desarrollo Personalizada",
        steps: this.generateDefaultSteps(answers)
      };
    }

    return path;
  }

  private generateTraitsFromAnswers(answers: AssessmentAnswer[]): Array<{ name: string; score: number }> {
    // Obtener los 3 rasgos más altos
    const sortedAnswers = [...answers].sort((a, b) => b.score - a.score);
    const topTraits = sortedAnswers.slice(0, 3);

    const traitNames: { [key: string]: string } = {
      theoretical: "Pensamiento Teórico",
      practical: "Orientación Práctica", 
      collaborative: "Colaborativo",
      discipline: "Autodisciplina",
      competitive: "Competitivo",
      multimedia: "Visual/Multimedia",
      depth: "Análisis Profundo",
      adaptability: "Adaptabilidad",
      feedback: "Orientado a Feedback"
    };

    return topTraits.map(trait => ({
      name: traitNames[trait.category] || trait.category,
      score: trait.score
    }));
  }

  private generateDefaultSteps(answers: AssessmentAnswer[]): Array<{ title: string; description: string; duration: string }> {
    const practical = answers.find(a => a.category === 'practical')?.score || 5;
    const collaborative = answers.find(a => a.category === 'collaborative')?.score || 5;
    const theoretical = answers.find(a => a.category === 'theoretical')?.score || 5;

    const steps = [];

    if (theoretical > 6) {
      steps.push({
        title: "Fundamentos Conceptuales",
        description: "Dominar los conceptos teóricos fundamentales mediante lectura profunda y análisis",
        duration: "2-3 semanas"
      });
    }

    if (practical > 6) {
      steps.push({
        title: "Aplicación Práctica",
        description: "Implementar conceptos a través de ejercicios, laboratorios y proyectos hands-on",
        duration: "3-4 semanas"
      });
    }

    if (collaborative > 6) {
      steps.push({
        title: "Proyectos Colaborativos",
        description: "Trabajar en equipo para resolver problemas complejos y desarrollar habilidades sociales",
        duration: "2-3 semanas"
      });
    }

    steps.push({
      title: "Síntesis y Evaluación",
      description: "Integrar todo el conocimiento adquirido y evaluar el progreso mediante un proyecto final",
      duration: "1-2 semanas"
    });

    return steps.slice(0, 4); // Máximo 4 pasos
  }

  private generateFallbackPath(answers: number[], categories: string[]): LearningPath {
    const avgScore = answers.reduce((sum, score) => sum + score, 0) / answers.length;
    const processedAnswers = this.processAnswers(answers, categories);
    
    let profileType = "Aprendiz Equilibrado";
    if (avgScore >= 7) profileType = "Aprendiz Avanzado";
    else if (avgScore <= 4) profileType = "Aprendiz en Desarrollo";

    return {
      description: `Eres un ${profileType.toLowerCase()} con un enfoque balanceado hacia el aprendizaje. Tu ruta está diseñada para maximizar tus fortalezas naturales.`,
      profile: {
        type: profileType,
        traits: this.generateTraitsFromAnswers(processedAnswers).slice(0, 3)
      },
      route: {
        name: "Ruta de Desarrollo Integral",
        steps: this.generateDefaultSteps(processedAnswers)
      }
    };
  }
}

// Singleton instance
let pathGenerator: LearningPathGenerator;

// Initialize generator
const initializeGenerator = () => {
  if (!pathGenerator) {
    pathGenerator = new LearningPathGenerator();
  }
};

// Export handler for Nuxt API
export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    });
  }

  try {
    initializeGenerator();
    
    const body = await readBody(event);
    const { userId, answers, questions } = body;
    
    if (!userId || !answers || !questions) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId, answers, and questions are required'
      });
    }

    // Validar que answers sea un array de números
    if (!Array.isArray(answers) || !answers.every(a => typeof a === 'number' && a >= 1 && a <= 9)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Answers must be an array of numbers between 1-9'
      });
    }

    console.log(`🎯 Generando ruta de aprendizaje para ${userId}`);
    console.log(`📊 Respuestas:`, answers);
    
    const learningPath = await pathGenerator.generatePath(userId, answers, questions);
    
    // Aquí podrías guardar el perfil en una base de datos
    // await saveUserProfile(userId, learningPath);
    
    console.log(`✅ Ruta generada para ${userId}: ${learningPath.profile.type}`);
    
    return {
      success: true,
      data: {
        learningPath,
        timestamp: new Date().toISOString(),
        userId
      }
    };
    
  } catch (error) {
    console.error('❌ Error en API generate-learning-path:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    });
  }
}); 