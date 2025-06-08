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
          <IconHome :active="navMenu.itemIsActive(NavPathEnum.home)" />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.clubs"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.clubs)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <IconClubs
            :active="navMenu.itemIsActive(NavPathEnum.clubs)"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.berles"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.berles)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <IconBerles :active="navMenu.itemIsActive(NavPathEnum.berles)" />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="NavPathEnum.habilidadesClub"
          @mouseover="navMenu.setHoveredItem(NavPathEnum.habilidadesClub)"
          @mouseleave="navMenu.setHoveredItem(null)"
        >
          <Icon
            name="lucide:trophy"
            class="item-icon text-xl"
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
</style>
