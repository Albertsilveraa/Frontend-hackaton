import { useAuth } from '@/composables'

export default defineNuxtRouteMiddleware((to) => {
  // Solo ejecutar en el cliente para evitar problemas de hidratación
  if (import.meta.server) return

  const { isAuthenticated, checkAuth } = useAuth()

  // Verificar autenticación actual
  checkAuth()

  // Permitir acceso a login incluso si no está autenticado
  if (to.path === '/login') {
    return
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
