<script setup lang="ts">
const { global } = useAppConfig()
const weekDays = [
  { initial: 'L', completed: true },
  { initial: 'MA', completed: true },
  { initial: 'MI', completed: true },
  { initial: 'J', completed: true },
  { initial: 'V', completed: true },
  { initial: 'S', completed: false },
  { initial: 'D', completed: false }
]
</script>

<template>
  <div
    class="rounded-3xl shadow-lg px-6 py-8 flex flex-col md:flex-row items-center gap-8 max-w-2xl mx-auto bg-[#fff6e5] dark:bg-[#10171f] transition-colors duration-300"
  >
    <!-- Avatar -->
    <div class="flex justify-center md:block">
      <UColorModeAvatar
        class="size-50 ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
        :light="global.picture?.light!"
        :dark="global.picture?.dark!"
        :alt="global.picture?.alt!"
        src="https://i.ibb.co/p65zLCnG/c684b1f7-8134-41fe-8452-4a8c8bcb71dc.png"
      />
    </div>
    <!-- Panel racha -->
    <div class="flex-1 w-full flex flex-col items-center gap-4">
      <div class="w-full flex flex-col items-center md:items-start">
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-3xl md:text-4xl font-extrabold text-[#e29e15] dark:text-[#ffd46c]"
          >
            372 días de racha
          </span>
          <img
            src="https://i.ibb.co/DP7Tct64/flame.gif"
            class="w-10 h-10"
          >
        </div>
        <p
          class="text-base text-[#ad8328] dark:text-[#ffca47]/90 text-center md:text-left leading-tight font-medium"
        >
          El protector de racha te salvó ayer.<br>
          Hoy depende de ti. ¡Practica ahora!
        </p>
      </div>
      <!-- Fondo de la racha -->
      <div
        class="rounded-xl px-7 py-4 shadow-md flex flex-col gap-2 w-full max-w-md bg-gray-100 dark:bg-[#232933] transition-colors duration-300"
      >
        <!-- Iniciales de los días -->
        <div class="flex justify-between items-center mb-2">
          <span
            v-for="(d, i) in weekDays"
            :key="'ini-' + i"
            class="text-base font-extrabold tracking-wide uppercase flex justify-center"
            :class="[
              d.completed ? 'text-red-500 dark:text-red-400' : '',
              d.initial === 'S' || d.initial === 'D'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-400 dark:text-gray-400'
            ]"
            style="width: 48px; text-align: center"
          >
            {{ d.initial }}
          </span>
        </div>
        <!-- Círculos -->
        <div class="flex justify-between items-end relative h-6">
          <template
            v-for="(d, i) in weekDays"
            :key="'day-' + i"
          >
            <div
              class="flex flex-col items-center"
              style="width: 48px"
            >
              <div
                class="w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 text-xl font-bold select-none shadow"
                :class="[
                  d.completed
                    ? 'bg-red-500 text-white border-red-500 dark:bg-red-400 dark:text-black dark:border-red-400'
                    : d.initial === 'S' || d.initial === 'D'
                      ? 'bg-transparent border-yellow-400 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400'
                      : 'bg-transparent border-gray-400 text-gray-400 dark:border-gray-500 dark:text-gray-500'
                ]"
              >
                <svg
                  v-if="d.completed"
                  width="22"
                  height="22"
                  viewBox="0 0 20 20"
                  fill="none"
                  class="pointer-events-none"
                >
                  <path
                    d="M5 10.5L8.5 14L15 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
