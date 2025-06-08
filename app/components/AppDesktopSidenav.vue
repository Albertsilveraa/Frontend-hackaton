<script setup lang="ts">
import { inject } from 'vue'
import { NavPathEnum, useNavMenu } from '@/composables'
import { Icon } from '#components'

const navMenu = useNavMenu()
const colorMode = useColorMode()

const isCollapsed = inject<Ref<boolean>>('isSidenavCollapsed')!
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

const getSidebarLogo = () => {
  if (colorMode.value === 'dark') {
    return isCollapsed.value
      ? 'https://i.ibb.co/9Hr4nGTS/utp-logo-white-for-dark.png' // dark, collapsed
      : 'https://i.ibb.co/zVhxmF4P/utp-clubs-darkmode.png' // dark, expanded
  } else if (colorMode.value === 'light') {
    return isCollapsed.value
      ? 'https://i.ibb.co/Fqw0fngs/utp-logo-transparent.png' // light, collapsed
      : 'https://i.ibb.co/9mqj8QCH/clubs-removebg-preview-1.png' // light, expanded
  } else {
    return isCollapsed.value
      ? 'https://i.ibb.co/9Hr4nGTS/utp-logo-white-for-dark.png' // dark, collapsed
      : 'https://i.ibb.co/zVhxmF4P/utp-clubs-darkmode.png' // dark, expanded
  }
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
        :src="getSidebarLogo()"
        :width="isCollapsed ? 50 : 150"
        class="logo"
      >
    </NuxtLink>

    <section class="nav-section">
      <template v-if="isCollapsed">
        <hr>
      </template>
      <template v-else>
        <p class="font-medium">
          General
        </p>
      </template>
      <ul class="menu-list">
        <li>
          <NuxtLink
            :to="NavPathEnum.home"
            class="menu-link"
            :class="{ collapsed: isCollapsed }"
            @mouseover="navMenu.setHoveredItem(NavPathEnum.home)"
            @mouseleave="navMenu.setHoveredItem(null)"
          >
            <Icon
              name="i-lucide-layout-dashboard"
              class="item-icon"
            />
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              Inicio
            </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="NavPathEnum.courses"
            class="menu-link"
            :class="{ collapsed: isCollapsed }"
            @mouseover="navMenu.setHoveredItem(NavPathEnum.courses)"
            @mouseleave="navMenu.setHoveredItem(null)"
          >
            <Icon
              name="i-lucide-book-open"
              class="item-icon"
            />
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              Cursos
            </span>
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
            <Icon
              name="i-lucide-users"
              class="item-icon"
            />
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              Clubs
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
    <section class="nav-section">
      <template v-if="isCollapsed">
        <hr>
      </template>
      <template v-else>
        <p class="font-medium">
          Otros
        </p>
      </template>
      <ul class="menu-list">
        <li>
          <NuxtLink
            :to="NavPathEnum.berles"
            class="menu-link"
            :class="{ collapsed: isCollapsed }"
            @mouseover="navMenu.setHoveredItem(NavPathEnum.berles)"
            @mouseleave="navMenu.setHoveredItem(null)"
          >
            <Icon
              name="i-mdi-message-text-outline"
              class="item-icon"
            />
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              Berles
            </span>
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
              name="i-heroicons-outline-user-circle"
              class="item-icon"
            />
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              Perfil
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="nav-section">
      <template v-if="isCollapsed">
        <hr>
      </template>
      <template v-else>
        <p class="font-medium">
          Ajustes
        </p>
      </template>
      <ul class="menu-list">
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
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
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
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              {{ isCollapsed ? 'Expandir' : 'Colapsar' }}
            </span>
          </button>
        </li>
      </ul>
    </section>
  </nav>
</template>

<style scoped>
.sidenav {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  height: 100%;
  padding: 24px 0;
  background-color: var(--color-sidebar-bg);
  color: var(--color-sidebar-tx);
  max-width: 239px;
  transition: width 300ms ease, padding 300ms ease;
}

.sidenav.collapsed {
  width: 80px;
}

.logo-link {
  display: block;
  margin-bottom: 15px;
}

.nav-section {
  width: 60%;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.menu-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 5px 12%;
}

.menu-link.collapsed {
  justify-content: center;
}

.menu-link:hover {
  background-color: var(--color-sidebar-hover);
  border-radius: 4px;
  color: var(--color-sidebar-bg);
}

.menu-label {
  white-space: nowrap;
}

.item-icon {
  width: 20px;
  height: 20px;
}

.collapsed > .item-icon {
  width: 25px;
  height: 25px;
}
</style>
