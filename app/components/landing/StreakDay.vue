<script setup lang="ts">
import IceBadge from './IceBadge.vue'

defineProps<{
  done: boolean
  day: number
  isToday?: boolean
  isFrozen?: boolean
}>()
</script>

<template>
  <div class="relative flex items-center justify-center">
    <div
      class="flex items-center justify-center rounded-full border-2 transition-all duration-300 select-none
      w-9 h-9 md:w-10 md:h-10 text-lg md:text-xl font-bold
      "
      :class="[
        done
          ? 'border-red-500 bg-red-900/40 text-red-500'
          : 'border-gray-600 bg-neutral-800 text-gray-400',
        isToday ? 'ring-2 ring-white' : ''
      ]"
    >
      <!-- Check SVG -->
      <svg
        v-if="done"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5 10.5L8.5 14L15 7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span v-else>
        {{ day }}
      </span>
    </div>
    <!-- Hielo/badge -->
    <IceBadge
      v-if="isFrozen"
      class="absolute -bottom-2 -right-2 w-6 h-6"
    />
  </div>
</template>
