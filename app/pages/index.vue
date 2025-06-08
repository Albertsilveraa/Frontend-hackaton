<script setup lang="ts">
import WeeklyStreak from '~/components/landing/WeeklyStreak.vue'
import CardsCourses from '~/components/landing/CardsCourses.vue'

const { isAuthenticated, checkAuth, needsAssessment, user } = useAuth()

// Verificar autenticación solo en el cliente
onMounted(async () => {
  console.log('🏠 Inicializando página home...')
  
  if (process.client) {
    checkAuth()
    await nextTick()
    
    console.log('🔍 Estado después de checkAuth:', {
      isAuthenticated: isAuthenticated.value,
      needsAssessment: needsAssessment.value,
      user: user.value
    })
    
    // Redirigir según el estado
    if (!isAuthenticated.value) {
      console.log('❌ No autenticado, redirigiendo a login')
      navigateTo('/login', { replace: true })
    } else if (needsAssessment.value) {
      console.log('📝 Necesita assessment, redirigiendo...')
      navigateTo('/assessment', { replace: true })
    } else {
      console.log('✅ Usuario listo, mostrando home')
    }
  }
})

// Meta tags
useSeoMeta({
  title: 'UTP+clubs - Inicio',
  description: 'Plataforma educacional universitaria con IA'
})

definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <!-- Loading mientras no esté autenticado -->
  <div v-if="!isAuthenticated" class="loading-container">
    <div class="loading-content">
      <div class="logo">
        <span class="utp-text">UTP</span><span class="clubs-text">+clubs</span>
      </div>
      <p>Cargando...</p>
      <div class="spinner"></div>
    </div>
  </div>

  <!-- Contenido principal cuando está autenticado -->
  <div v-else class="home-container">
    <!-- Hero Section Personalizado -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="text-content">
          <h1 class="hero-title">🎓 Bienvenido a UTP+clubs</h1>
          <p class="hero-subtitle">Conexión, networking y crecimiento personal</p>
          <p class="hero-description">
            Tu plataforma educacional universitaria con inteligencia artificial personalizada
          </p>
          
          <div class="user-greeting">
            <span class="greeting-text">¡Hola {{ user?.codigo }}! 👋</span>
          </div>
        </div>
        
        <div class="hero-actions">
          <NuxtLink to="/berles" class="hero-cta primary">
            <Icon name="lucide:bot" />
            Hablar con Berles
          </NuxtLink>
          
          <NuxtLink to="/habilidades-club" class="hero-cta secondary">
            <Icon name="lucide:trophy" />
            Ver mis Habilidades
          </NuxtLink>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="hero-decoration">
        <div class="floating-card">
          <Icon name="lucide:brain" />
          <span>IA Educacional</span>
        </div>
        <div class="floating-card">
          <Icon name="lucide:users" />
          <span>Clubs Universitarios</span>
        </div>
        <div class="floating-card">
          <Icon name="lucide:target" />
          <span>Rutas Personalizadas</span>
        </div>
      </div>
    </section>

    <!-- Weekly Streak Section -->
    <section class="streak-section">
      <div class="streak-container">
        <h2>🔥 Tu Progreso Semanal</h2>
        <WeeklyStreak />
      </div>
    </section>

    <!-- Cursos Generales Section -->
    <section class="courses-section">
      <div class="courses-container">
        <h2>📚 Cursos Generales</h2>
        <p class="courses-description">
          Explora nuestros cursos disponibles y continúa tu aprendizaje
        </p>
        <CardsCourses />
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-container">
        <h2>🚀 Herramientas Disponibles</h2>
        
        <div class="features-grid">
          <NuxtLink to="/berles" class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Berles</h3>
            <p>Tu asistente de IA educacional personalizado para resolver dudas académicas</p>
            <span class="feature-arrow">→</span>
          </NuxtLink>
          
          <NuxtLink to="/assessment" class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Assessment</h3>
            <p>Evaluación de tu perfil de aprendizaje para rutas personalizadas</p>
            <span class="feature-arrow">→</span>
          </NuxtLink>
          
          <NuxtLink to="/habilidades-club" class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Habilidades de Club</h3>
            <p>Descubre tus fortalezas y desarrolla tu potencial académico</p>
            <span class="feature-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-content .logo {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.loading-content .utp-text {
  background: white;
  color: #667eea;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  margin-right: 0.5rem;
}

.loading-content .clubs-text {
  color: white;
}

.loading-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 2;
}

.text-content {
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.user-greeting {
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.greeting-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s;
  text-align: center;
  justify-content: center;
}

.hero-cta.primary {
  background: white;
  color: #667eea;
}

.hero-cta.primary:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-cta.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hero-cta.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-decoration {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

.floating-card:nth-child(2) {
  animation-delay: -1s;
}

.floating-card:nth-child(3) {
  animation-delay: -2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.streak-section {
  padding: 4rem 2rem;
  background: #f8fafc;
}

.streak-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.streak-container h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 3rem;
}

.courses-section {
  padding: 4rem 2rem;
  background: white;
}

.courses-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.courses-container h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
}

.courses-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.features-section {
  padding: 4rem 2rem;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features-container h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 2rem;
  font-size: 1.5rem;
  color: #667eea;
  transition: transform 0.3s;
}

.feature-card:hover .feature-arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-decoration {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    flex-direction: row;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .floating-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
