import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Inicio',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Clubs',
  icon: 'i-lucide-folder',
  to: '/clubs'
}, {
  label: 'Courses',
  icon: 'i-lucide-file-text',
  to: '/courses'
}, {
  label: 'Speaking',
  icon: 'i-lucide-mic',
  to: '/speaking'
}, {
  label: 'Perfil',
  icon: 'i-lucide-user',
  to: '/profile'
}]
