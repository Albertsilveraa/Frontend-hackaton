import { ref } from 'vue'
import { useRoute } from 'nuxt/app'

export enum NavPathEnum {
  home = '/',
  courses = '/courses',
  clubs = '/clubs',
  berles = '/berles',
  profile = '/profile'
}

export function useNavMenu() {
  const route = useRoute()

  const hoveredItem = ref<NavPathEnum | null>(null)

  function setHoveredItem(navRoute: NavPathEnum | null): void {
    hoveredItem.value = navRoute
  }

  function itemIsActive(navRoute: NavPathEnum): boolean {
    return hoveredItem.value === navRoute || route.path === navRoute
  }

  return { setHoveredItem, itemIsActive }
}
