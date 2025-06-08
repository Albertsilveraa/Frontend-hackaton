<script setup lang="ts">
import { ref, provide } from 'vue'
import AppDesktopSidenav from '@/components/AppDesktopSidenav.vue'
import AppMobileNavbar from '@/components/AppMobileNavbar.vue'

// Controla el estado colapsado
const isCollapsed = ref(false)

// Provee estado a los componentes hijos
provide('isSidenavCollapsed', isCollapsed)
</script>

<template>
  <div
    class="grid-layout"
    :class="{ 'sidebar-collapsed': isCollapsed }"
  >
    <div class="desktop-sidenav-area">
      <AppDesktopSidenav />
    </div>
    <div class="content-area">
      <div class="max-w-screen-xl w-full">
        <slot />
      </div>
    </div>
    <div class="mobile-navbar-area">
      <AppMobileNavbar />
    </div>
  </div>
</template>

<style scoped>
.desktop-sidenav-area {
  display: none;
}

.mobile-navbar-area {
  grid-area: mobile-navbar;
}

.content-area {
  position: relative;
  grid-area: content;
  display: flex;
  justify-content: center;
  overflow: auto;
  padding: 20px;
}

.grid-layout {
  display: grid;
  background-color: var(--background-primary);
  height: 100%;
  width: 100%;
  grid-template-rows: 1fr;
  grid-template-areas:
    'content content'
    'content content'
    'mobile-navbar mobile-navbar';
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 80px 1fr;
    grid-template-areas:
      'content'
      'content';
    background-color: var(--background-secondary);
    transition: grid-template-columns 300ms ease;
  }

  .desktop-sidenav-area {
    display: block;
    position: fixed;
    top: 15px;
    left: 15px;
    bottom: 15px;
    width: 239px;
    background-color: var(--color-sidebar-bg);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    transition: width 300ms ease, left 300ms ease;
    overflow: hidden;
    z-index: 50;
  }

  .grid-layout.sidebar-collapsed .desktop-sidenav-area {
    width: 80px;
  }

  .content-area {
    padding: 24px 32px 0;
    margin-left: 239px; /* Deja espacio para el sidenav flotante */
    transition: margin-left 300ms ease;
  }

  .grid-layout.sidebar-collapsed .content-area {
    margin-left: 80px;
  }

  .mobile-navbar-area {
    display: none;
  }
}
</style>
