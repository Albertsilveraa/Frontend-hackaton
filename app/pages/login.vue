<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-section">
          <div class="illustration">
            <div class="people-group">
              <div class="person person-1">
                <div class="person-body" />
                <div class="person-head" />
              </div>
              <div class="person person-2">
                <div class="person-body" />
                <div class="person-head" />
                <div class="tennis-racket" />
              </div>
              <div class="person person-3">
                <div class="person-body" />
                <div class="person-head" />
              </div>
            </div>
            <div class="activities">
              <div class="activity">
                Design
              </div>
              <div class="activity">
                Tennis
              </div>
              <div class="activity">
                Public speaking
              </div>
            </div>
          </div>
        </div>

        <div class="brand-section">
          <div class="brand-logo">
            <span class="utp-text">UTP</span><span class="clubs-text">+clubs</span>
          </div>
          <h2>Conexión, networking y crecimiento personal</h2>
          <p>Únete a clubes universitarios</p>
        </div>
      </div>

      <div class="login-form-section">
        <form
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <div class="form-group">
            <label for="codigo">Código UTP</label>
            <input
              id="codigo"
              v-model="form.codigo"
              type="text"
              placeholder="Ingresa tu usuario"
              :disabled="isLoading"
              required
            >
            <small
              v-if="form.codigo"
              class="helper-text"
            >
              Ejemplo de usuario: U2013140 (no digital @utp.edu.pe)
            </small>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="password-toggle"
                :disabled="isLoading"
                @click="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" />
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <a
              href="#"
              @click.prevent=""
            >Restablecer contraseña</a>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="isLoading || !form.codigo || !form.password"
          >
            <span v-if="isLoading">Iniciando sesión...</span>
            <span v-else>Iniciar sesión</span>
          </button>

          <div
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </div>

          <!-- Botón de emergencia para limpiar datos -->
          <div class="emergency-section">
            <button
              type="button"
              class="clear-data-button"
              title="Limpiar datos de la aplicación"
              @click="clearDataAndReload"
            >
              🧹 Limpiar datos
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const form = reactive({
  codigo: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Función de emergencia para limpiar datos
const { clearAllData } = useAuth()
const clearDataAndReload = () => {
  console.log('🧹 Limpiando toda la base de datos local...')
  clearAllData()
  console.log('🔄 Recargando página...')
  window.location.reload()
}

const handleLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await login(form)

    if (success) {
      router.push('/assessment')
    } else {
      errorMessage.value = 'Código UTP o contraseña incorrectos'
    }
  } catch (error) {
    console.error('Error during login:', error)
    errorMessage.value = 'Error al iniciar sesión. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}

// Verificar si ya está autenticado
const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  navigateTo('/')
}

// Meta tags
useSeoMeta({
  title: 'Login - UTP+clubs',
  description: 'Inicia sesión en UTP+clubs para acceder a tu asistente educacional Berles.'
})

// Sin layout - página independiente
definePageMeta({ layout: false })
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  background: #f8fafc;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.illustration {
  margin-bottom: 2rem;
}

.people-group {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.person-head {
  width: 30px;
  height: 30px;
  background: #fbbf24;
  border-radius: 50%;
  margin-bottom: 5px;
}

.person-body {
  width: 25px;
  height: 40px;
  border-radius: 10px;
}

.person-1 .person-body {
  background: #ef4444;
}

.person-2 .person-body {
  background: #3b82f6;
}

.person-3 .person-body {
  background: #000;
}

.person-2 {
  position: relative;
}

.tennis-racket {
  width: 20px;
  height: 30px;
  background: #8b5cf6;
  border-radius: 10px;
  position: absolute;
  right: -15px;
  top: -10px;
  transform: rotate(45deg);
}

.activities {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 1rem;
}

.brand-logo {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.utp-text {
  background: black;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.clubs-text {
  color: black;
}

.brand-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.brand-section p {
  color: #6b7280;
  font-size: 1rem;
}

.login-form-section {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form {
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.helper-text {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.password-toggle:hover:not(:disabled) {
  color: #374151;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.forgot-password {
  text-align: right;
  margin-bottom: 1.5rem;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  background: #000;
  color: white;
  border: none;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #374151;
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
  border: 1px solid #fecaca;
}

.emergency-section {
  text-align: right;
  margin-top: 1rem;
}

.clear-data-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

@media (max-width: 768px) {
  .login-card {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .login-header {
    padding: 2rem 1rem;
  }

  .login-form-section {
    padding: 2rem 1rem;
  }

  .people-group {
    transform: scale(0.8);
  }

  .brand-section h2 {
    font-size: 1.25rem;
  }

  .activities {
    gap: 1rem;
    font-size: 0.75rem;
  }
}
</style>
