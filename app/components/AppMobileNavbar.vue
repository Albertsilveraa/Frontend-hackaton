<script setup lang="ts">
import { NavPathEnum, useNavMenu } from '@/composables'

const navMenu = useNavMenu()
</script>

<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li>
        <NuxtLink
          :to="NavPathEnum.home"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.home)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="i-lucide-layout-dashboard"
            class="item-icon"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.courses"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.courses)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="i-lucide-book-open"
            class="item-icon"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.clubs"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.clubs)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="i-lucide-users"
            class="item-icon"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.berles"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.berles)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="i-mdi-message-text-outline"
            class="item-icon"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.profile"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.profile)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="i-heroicons-outline-user-circle"
            class="item-icon"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 69px;
  padding: 0 10px;
  box-shadow: 0px -4px 4px 0px rgba(76, 88, 237, 0.08);
  background-color: var(--color-sidebar);
}

.navbar-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  height: 100%;
}

.item-icon {
  width: 25px;
  height: 25px;
}
</style>
