<script setup lang="ts">
import { users } from '~/utils/courses'
</script>

<template>
  <Motion
    :initial="{ opacity: 0, transform: 'translateY(16px)' }"
    :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
    :transition="{ delay: 0.08, duration: 0.5 }"
    :in-view-options="{ once: true }"
  >
    <UPageList divide>
      <UPageCard
        v-for="(user, index) in users"
        :key="index"
        variant="ghost"
        :to="user.to"
        :target="user.target"
      >
        <template #body>
          <UUser
            :name="user.name"
            :description="user.description"
            :avatar="user.avatar"
            size="xl"
          />
          <UProgress
            v-model="user.progress"
            class="mt-2"
            status
            :color="user.progress >= 50 ? 'success' : 'warning'"
          />
        </template>
      </UPageCard>
    </UPageList>
  </Motion>
</template>
