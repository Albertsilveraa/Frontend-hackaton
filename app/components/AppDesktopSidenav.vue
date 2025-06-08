<script setup lang="ts">
import { ref, inject } from 'vue'
import { NavPathEnum, useNavMenu } from '@/composables'
import { Icon } from '#components'

const navMenu = useNavMenu()
const colorMode = useColorMode()

const isCollapsed = inject<Ref<boolean>>('isSidenavCollapsed')!
const menuList = ref<HTMLUListElement | undefined>()
const nextTheme = computed(() => (colorMode.value === 'dark' ? 'light' : 'dark'))

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const switchTheme = () => {
  colorMode.preference = nextTheme.value
}

const startViewTransition = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  transition.ready.then(() => {
    const duration = 600
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: duration,
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
</script>

<template>
  <nav
    class="sidenav"
    :class="{ collapsed: isCollapsed }"
  >
    <NuxtLink
      :to="NavPathEnum.home"
      class="logo-link"
    >
      <img
        :src="isCollapsed
          ? 'https://i.ibb.co/9Hr4nGTS/utp-logo-white-for-dark.png'
          : 'https://i.ibb.co/zVhxmF4P/utp-clubs-darkmode.png'"
        :width="isCollapsed ? 50 : 150"
        class="logo"
      >
    </NuxtLink>

    <ul
      ref="menuList"
      class="menu-list"
    >
      <li>
        <NuxtLink
          :to="NavPathEnum.home"
          class="menu-link"
          :class="{ collapsed: isCollapsed }"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.home)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <IconHome :active="navMenu.itemIsActive(NavPathEnum.home)" />
          <span class="menu-label">Home</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.clubs"
          class="menu-link"
          :class="{ collapsed: isCollapsed }"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.clubs)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <IconClubs :active="navMenu.itemIsActive(NavPathEnum.clubs)" />
          <span class="menu-label">Clubs</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.berles"
          class="menu-link"
          :class="{ collapsed: isCollapsed }"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.berles)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <IconBerles :active="navMenu.itemIsActive(NavPathEnum.berles)" />
          <span class="menu-label">Berles</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.profile"
          class="menu-link"
          :class="{ collapsed: isCollapsed }"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.profile)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="heroicons-outline:user"
            class="item-icon"
          />
          <span class="menu-label">Perfil</span>
        </NuxtLink>
      </li>
      <li>
        <button
          class="menu-link p-0"
          :class="{ collapsed: isCollapsed }"
          @click="startViewTransition"
        >
          <Icon
            :name="`i-lucide-${nextTheme === 'dark' ? 'sun' : 'moon'}`"
            class="item-icon"
          />
          <span class="menu-label">
            {{ nextTheme === 'dark' ? 'Dark' : 'Light' }}
          </span>
        </button>
      </li>
      <li>
        <button
          class="menu-link p-0 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-none text-inherit hover:text-inherit"
          :class="{ collapsed: isCollapsed }"
          @click="toggleSidebar"
        >
          <Icon
            :name="isCollapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'"
            class="item-icon"
          />
          <span class="menu-label">
            {{ isCollapsed ? 'Expandir' : 'Colapsar' }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidenav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 24px 0;
  background-color: var(--color-sidebar-bg);
  color: var(--color-sidebar-tx);
  width: 239px;
  transition: width 300ms ease, padding 300ms ease;
}

.sidenav.collapsed {
  width: 80px;
}

.logo-link {
  display: block;
}

.menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0;
  margin: 50px 0 0;
  list-style: none;
}

.menu-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.menu-link.collapsed {
  flex-direction: column;
  gap: 2px;
  justify-content: center;
}

.menu-label {
  white-space: nowrap;
}

.menu-link.collapsed .menu-label {
  text-align: center;
  font-size: 14px;
}

.item-icon {
  width: 25px;
  height: 25px;
}
</style>
