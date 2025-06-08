<template>
  <div class="habilidades-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1>🏆 Habilidades de Club</h1>
          <p>Tu perfil de aprendizaje personalizado</p>
        </div>
        
        <div class="user-info">
          <Icon name="lucide:user" />
          <span>{{ user?.codigo }}</span>
        </div>
      </div>
    </div>

    <div class="content-section">
      <!-- Si tiene perfil de aprendizaje -->
      <div v-if="user?.learningProfile" class="profile-container">
        <!-- Resumen del perfil -->
        <div class="profile-summary-card">
          <div class="profile-header">
            <div class="profile-icon">🎓</div>
            <div class="profile-info">
              <h2>{{ user.learningProfile.profile.type }}</h2>
              <p>{{ user.learningProfile.description }}</p>
            </div>
          </div>
        </div>

        <!-- Fortalezas identificadas -->
        <div class="strengths-section">
          <h3>💪 Tus Fortalezas Principales</h3>
          <div class="traits-grid">
            <div 
              v-for="trait in user.learningProfile.profile.traits" 
              :key="trait.name"
              class="trait-card"
              :style="{ '--intensity': trait.score / 9 }"
            >
              <div class="trait-score">{{ trait.score }}/9</div>
              <h4>{{ trait.name }}</h4>
              <div class="trait-bar">
                <div class="trait-fill" :style="{ width: `${(trait.score / 9) * 100}%` }"></div>
              </div>
              <p class="trait-level">{{ getTraitLevel(trait.score) }}</p>
            </div>
          </div>
        </div>

        <!-- Ruta de aprendizaje -->
        <div class="learning-route-section">
          <h3>🛤️ Tu Ruta de Desarrollo</h3>
          <div class="route-timeline">
            <div 
              v-for="(step, index) in user.learningProfile.route.steps" 
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-marker">
                <div class="marker-number">{{ index + 1 }}</div>
              </div>
              <div class="timeline-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
                <div class="step-duration">
                  <Icon name="lucide:clock" />
                  {{ step.duration }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="actions-section">
          <NuxtLink to="/berles" class="action-btn primary">
            <Icon name="lucide:bot" />
            Consultar con Berles
          </NuxtLink>
          <NuxtLink to="/assessment" class="action-btn secondary">
            <Icon name="lucide:refresh-cw" />
            Repetir Assessment
          </NuxtLink>
        </div>
      </div>

      <!-- Si no tiene perfil -->
      <div v-else class="no-profile-container">
        <div class="no-profile-card">
          <div class="no-profile-icon">🎯</div>
          <h2>¡Descubre tus Habilidades!</h2>
          <p>Completa nuestro assessment para conocer tu perfil de aprendizaje y obtener recomendaciones personalizadas.</p>
          
          <div class="features-list">
            <div class="feature-item">
              <Icon name="lucide:brain" />
              <span>Análisis de tu estilo de aprendizaje</span>
            </div>
            <div class="feature-item">
              <Icon name="lucide:target" />
              <span>Identificación de fortalezas</span>
            </div>
            <div class="feature-item">
              <Icon name="lucide:route" />
              <span>Ruta personalizada de desarrollo</span>
            </div>
          </div>
          
          <NuxtLink to="/assessment" class="start-assessment-btn">
            <Icon name="lucide:play" />
            Comenzar Assessment
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const { user, checkAuth } = useAuth()

const getTraitLevel = (score: number) => {
  if (score >= 8) return "Excelente"
  if (score >= 6) return "Bueno"
  if (score >= 4) return "Moderado"
  return "En desarrollo"
}

// Meta tags
useSeoMeta({
  title: 'Habilidades de Club - UTP+clubs',
  description: 'Tu perfil de aprendizaje personalizado y habilidades de club'
})

// Asegurar que tenemos los datos más recientes
onMounted(() => {
  console.log('🏆 Inicializando Habilidades de Club...')
  if (process.client) {
    checkAuth()
    console.log('👤 Usuario actual:', user.value)
    console.log('📊 Perfil de aprendizaje:', user.value?.learningProfile)
  }
})
</script>

<style scoped>
.habilidades-container {
  min-height: 100vh;
  background: #f8fafc;
}

.header-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.title-section h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.title-section p {
  color: #6b7280;
  font-size: 1.125rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.profile-summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-icon {
  font-size: 4rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.profile-info h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.profile-info p {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
}

.strengths-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.trait-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.trait-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: calc(var(--intensity) * 0.8 + 0.2);
}

.trait-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.trait-score {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #667eea;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
}

.trait-card h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.trait-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.trait-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.trait-level {
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
}

.learning-route-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.route-timeline {
  position: relative;
  padding-left: 2rem;
}

.route-timeline::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #667eea, #764ba2);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.timeline-marker {
  position: relative;
  z-index: 2;
}

.marker-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.timeline-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.timeline-content h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.timeline-content p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.step-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
}

.actions-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.secondary:hover {
  background: #667eea;
  color: white;
}

.no-profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.no-profile-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 500px;
}

.no-profile-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.no-profile-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.no-profile-card p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4b5563;
}

.start-assessment-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #667eea;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.start-assessment-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .content-section {
    padding: 2rem 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .traits-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .no-profile-card {
    padding: 2rem;
  }
}
</style> 