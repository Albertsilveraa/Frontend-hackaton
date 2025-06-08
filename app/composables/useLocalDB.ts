interface User {
  id: string
  codigo: string
  hasCompletedAssessment: boolean
  learningProfile?: any
  createdAt: string
  updatedAt: string
}

interface AssessmentResult {
  id: string
  userId: string
  answers: number[]
  learningPath: any
  completedAt: string
}

export const useLocalDB = () => {
  const DB_KEYS = {
    USERS: 'localdb_users',
    ASSESSMENTS: 'localdb_assessments',
    CURRENT_USER: 'localdb_current_user'
  }

  // Inicializar DB
  const initDB = () => {
    if (import.meta.client) {
      if (!localStorage.getItem(DB_KEYS.USERS)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify({}))
      }
      if (!localStorage.getItem(DB_KEYS.ASSESSMENTS)) {
        localStorage.setItem(DB_KEYS.ASSESSMENTS, JSON.stringify({}))
      }
    }
  }

  // Obtener todos los usuarios
  const getUsers = (): Record<string, User> => {
    if (!import.meta.client) return {}
    const users = localStorage.getItem(DB_KEYS.USERS)
    return users ? JSON.parse(users) : {}
  }

  // Obtener usuario por código
  const getUserByCodigo = (codigo: string): User | null => {
    const users = getUsers()
    return Object.values(users).find(user => user.codigo === codigo) || null
  }

  // Crear o actualizar usuario
  const saveUser = (codigo: string, data: Partial<User>): User => {
    const users = getUsers()
    const existingUser = getUserByCodigo(codigo)

    const user: User = {
      id: existingUser?.id || `user_${Date.now()}`,
      codigo,
      hasCompletedAssessment: false,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    }

    users[user.id] = user

    if (import.meta.client) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users))
    }

    return user
  }

  // Guardar resultado de assessment
  const saveAssessment = (userId: string, answers: number[], learningPath: any): AssessmentResult => {
    if (!import.meta.client) throw new Error('No se puede guardar en el servidor')

    const assessments = JSON.parse(localStorage.getItem(DB_KEYS.ASSESSMENTS) || '{}')

    const assessment: AssessmentResult = {
      id: `assessment_${Date.now()}`,
      userId,
      answers,
      learningPath,
      completedAt: new Date().toISOString()
    }

    assessments[assessment.id] = assessment
    localStorage.setItem(DB_KEYS.ASSESSMENTS, JSON.stringify(assessments))

    // Actualizar usuario
    const users = getUsers()
    const user = Object.values(users).find(u => u.id === userId)
    if (user) {
      user.hasCompletedAssessment = true
      user.learningProfile = learningPath
      user.updatedAt = new Date().toISOString()
      users[user.id] = user
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users))
    }

    return assessment
  }

  // Obtener assessment de usuario
  const getUserAssessment = (userId: string): AssessmentResult | null => {
    if (!import.meta.client) return null

    const assessments = JSON.parse(localStorage.getItem(DB_KEYS.ASSESSMENTS) || '{}')
    return Object.values(assessments).find((a: any) => a.userId === userId) as AssessmentResult || null
  }

  // Login
  const login = (codigo: string, password: string): User | null => {
    // Credenciales hardcodeadas
    if (codigo !== 'U20200665' || password !== '72836921') {
      return null
    }

    initDB()

    let user = getUserByCodigo(codigo)
    if (!user) {
      user = saveUser(codigo, { hasCompletedAssessment: false })
    }

    // Guardar usuario actual
    if (import.meta.client) {
      localStorage.setItem(DB_KEYS.CURRENT_USER, user.id)
    }

    return user
  }

  // Obtener usuario actual
  const getCurrentUser = (): User | null => {
    if (!import.meta.client) return null

    const currentUserId = localStorage.getItem(DB_KEYS.CURRENT_USER)
    if (!currentUserId) return null

    const users = getUsers()
    return users[currentUserId] || null
  }

  // Logout
  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem(DB_KEYS.CURRENT_USER)
    }
  }

  // Limpiar toda la DB
  const clearDB = () => {
    if (import.meta.client) {
      Object.values(DB_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    }
  }

  return {
    initDB,
    login,
    logout,
    getCurrentUser,
    saveUser,
    saveAssessment,
    getUserAssessment,
    clearDB
  }
}
