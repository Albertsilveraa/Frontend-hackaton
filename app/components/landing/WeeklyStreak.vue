<script setup lang="ts">
const props = defineProps<{
  days: boolean[]
}>()

const { global } = useAppConfig()
const daysPerRow = 7

const rows = computed(() => {
  return Array.from(
    { length: Math.ceil(props.days.length / daysPerRow) },
    (_, row) => props.days.slice(row * daysPerRow, (row + 1) * daysPerRow)
  )
})
</script>

<template>
  <div
    class="flex flex-row items-start gap-2 sm:gap-4 md:gap-5 py-0 justify-center w-full max-w-full"
  >
    <div class="hidden md:block mr-4">
      <UColorModeAvatar
        class="size-50 ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
        :light="global.picture?.light!"
        :dark="global.picture?.dark!"
        :alt="global.picture?.alt!"
        src="https://i.ibb.co/p65zLCnG/c684b1f7-8134-41fe-8452-4a8c8bcb71dc.png"
      />
    </div>
    <!-- Timeline -->
    <div class="flex flex-col gap-5 justify-center w-full">
      <div
        v-for="(week, weekIdx) in rows"
        :key="weekIdx"
        class="flex items-center justify-center w-full"
      >
        <div
          v-for="(done, i) in week"
          :key="i"
          class="flex items-center"
        >
          <div
            class="w-5 h-5 sm:w-7 sm:h-9 md:w-9 md:h-9 flex items-center justify-center rounded-full border-2
           text-[10px] sm:text-xs md:text-base transition-all duration-300
           dark:bg-black dark:border-gray-600 dark:text-gray-400
           bg-white border-gray-300 text-gray-600"
            :class="done
              ? 'border-red-500 bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-500'
              : ''"
          >
            <span
              v-if="done"
              class="font-bold"
            >✔</span>
            <span
              v-else
              class="font-bold"
            >{{ weekIdx * 7 + i + 1 }}</span>
          </div>
          <!-- Línea de unión -->
          <div
            v-if="i < week.length - 1"
            class="w-2 sm:w-4 md:w-6 h-0.5 mx-[1px] sm:mx-1 rounded bg-gray-300 dark:bg-gray-700"
            :class="done ? 'bg-red-200 dark:bg-red-900/30' : ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>
