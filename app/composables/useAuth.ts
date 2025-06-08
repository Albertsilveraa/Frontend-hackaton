import { useLocalDB } from './useLocalDB'

interface User {
  id: string
  codigo: string
  hasCompletedAssessment: boolean
  learningProfile?: any
  createdAt: string
  updatedAt: string
}

export const useAuth = () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)

  const {
    initDB,
    login: dbLogin,
    logout: dbLogout,
    getCurrentUser,
    saveAssessment,
    clearDB
  } = useLocalDB()

  const checkAuth = () => {
    console.log('🔍 Verificando autenticación con DB local...')

    if (import.meta.client) {
      initDB()
      const currentUser = getCurrentUser()

      if (currentUser) {
        user.value = currentUser
        isAuthenticated.value = true
        console.log('✅ Usuario autenticado:', currentUser)
      } else {
        user.value = null
        isAuthenticated.value = false
        console.log('❌ No hay usuario autenticado')
      }
    }
  }

  const login = async (credentials: { codigo: string, password: string }) => {
    try {
      console.log('🔑 Intentando login...', credentials.codigo)

      const loggedUser = dbLogin(credentials.codigo, credentials.password)

      if (loggedUser) {
        user.value = loggedUser
        isAuthenticated.value = true
        console.log('✅ Login exitoso:', loggedUser)
        return true
      } else {
        console.log('❌ Credenciales incorrectas')
        return false
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      return false
    }
  }

  const logout = () => {
    console.log('🚪 Cerrando sesión...')
    dbLogout()
    user.value = null
    isAuthenticated.value = false
    console.log('✅ Sesión cerrada')
  }

  const updateUserProfile = (learningProfile: any) => {
    console.log('📝 Guardando perfil de aprendizaje...', learningProfile)

    if (user.value && import.meta.client) {
      try {
        // Guardar assessment en la DB
        saveAssessment(user.value.id, [], learningProfile)

        // Actualizar estado local
        user.value.hasCompletedAssessment = true
        user.value.learningProfile = learningProfile

        console.log('✅ Perfil guardado exitosamente')

        // Refrescar desde la DB para asegurar consistencia
        checkAuth()
      } catch (error) {
        console.error('❌ Error guardando perfil:', error)
      }
    } else {
      console.error('❌ No hay usuario para actualizar')
    }
  }

  const clearAllData = () => {
    console.log('🧹 Limpiando toda la base de datos...')
    clearDB()
    user.value = null
    isAuthenticated.value = false
    console.log('✅ Base de datos limpiada')
  }

  const needsAssessment = computed(() => {
    const result = isAuthenticated.value && user.value && !user.value.hasCompletedAssessment
    console.log('🔍 ¿Necesita assessment?', {
      isAuthenticated: isAuthenticated.value,
      hasUser: !!user.value,
      hasCompleted: user.value?.hasCompletedAssessment,
      needsIt: result
    })
    return result
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    login,
    logout,
    checkAuth,
    updateUserProfile,
    needsAssessment: readonly(needsAssessment),
    clearAllData
  }
}
