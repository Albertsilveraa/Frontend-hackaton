<script setup lang="ts">
import { tests } from '~/utils/results'

const first = ref(false)

const questions = [
  '¿Te gusta trabajar en equipo?',
  '¿Prefieres planes improvisados?',
  '¿Te estresas fácilmente?',
  '¿Te consideras creativo?',
  '¿Eres puntual generalmente?'
]

const resultImage = ref('')
const description = ref('')

const answers = ref<string[]>(questions.map(() => ''))

const submitTest = () => {
  const positiveAnswersCount = answers.value.filter(
    answer => answer === 'si'
  ).length

  switch (positiveAnswersCount) {
    case 5:
      resultImage.value = 'https://i.ibb.co/Gvck9cTt/alegria.png'
      description.value
        = '¡Tu actitud positiva inspira a los demás! Siempre ves el lado bueno de las situaciones y contagias entusiasmo a quienes te rodean. Tu optimismo te ayuda a superar los desafíos y a mantener un ambiente armonioso en cualquier grupo.'
      break
    case 4:
      resultImage.value = 'https://i.ibb.co/r20fDRCY/desagrado.png'
      description.value
        = 'Eres honesto y sabes lo que no te gusta. No temes expresar tus opiniones y establecer límites claros, lo que te permite mantener relaciones auténticas y saludables. Tu sinceridad es una fortaleza que te ayuda a crecer y aprender de cada experiencia.'
      break
    case 3:
      resultImage.value = 'https://i.ibb.co/SbfTNRF/temor.png'
      description.value
        = 'Reconoces tus miedos y trabajas para superarlos. Eres consciente de tus inseguridades, pero no permites que te detengan. Afrontas los retos con valentía y buscas constantemente mejorar, lo que te convierte en una persona resiliente y perseverante.'
      break
    case 2:
      resultImage.value = 'https://i.ibb.co/N6TL650p/furia.png'
      description.value
        = 'Tienes una gran energía, canalízala para lograr tus metas. A veces puedes sentirte frustrado, pero sabes transformar esa fuerza en motivación para avanzar. Tu determinación te impulsa a luchar por lo que quieres y a no rendirte fácilmente.'
      break
    case 1:
      resultImage.value = 'https://i.ibb.co/1Ys7q0DG/tristeza.png'
      description.value
        = 'Eres empático y comprendes las emociones profundas. Tienes una sensibilidad especial para conectar con los demás y ofrecer apoyo cuando más lo necesitan. Tu capacidad de introspección te permite aprender de cada experiencia emocional y crecer como persona.'
      break
    default:
      resultImage.value = ''
  }

  first.value = false
}
</script>

<template>
  <UPageSection
    title="Insighst"
    description="Evalua tus conocimientos y habilidades"
    :ui="{
      container: '!p-0 !mt-0 !mb-0 w-full',
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl font-medium',
      description: 'mt-2 text-muted text-left'
    }"
  >
    <Motion
      :initial="{ opacity: 0, transform: 'translateY(16px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.08, duration: 0.5 }"
      :in-view-options="{ once: true }"
    >
      <UPageList divide>
        <UPageCard
          v-for="(user, index) in tests"
          :key="index"
          variant="ghost"
          :ui="{ body: 'flex flex-col w-full text-left py-1 !my-0' }"
        >
          <template #body>
            <UUser
              v-if="!resultImage"
              :name="user.name"
              size="xl"
            />
            <UUser
              v-if="resultImage"
              :name="user.name"
              :description="index === 2 ? description.valueOf() : ''"
              :avatar="index === 2 ? { src: resultImage } : undefined"
              size="xl"
            />
            <UProgress
              v-if="index !== 2"
              v-model="user.progress"
              status
              :color="user.progress >= 50 ? 'primary' : 'error'"
            />
          </template>
        </UPageCard>
      </UPageList>
    </Motion>
    <UModal v-model:open="first">
      <UButton
        v-if="!resultImage"
        color="error"
        variant="solid"
        label="Realizar Test Psicológico"
        class="w-full justify-center"
      />

      <template #content>
        <div class="flex flex-col gap-3 p-8">
          <h2 class="text-2xl font-bold text-center">
            Descubre quién eres de verdad
          </h2>
          <p class="text-muted text-center">
            Con este test, descubrirás tu tipo de personalidad exacto.
          </p>

          <div
            v-for="(question, index) in questions"
            :key="index"
            class="flex justify-between items-center"
          >
            <span>{{ question }}</span>
            <div class="flex gap-5">
              <UCheckbox
                size="xl"
                variant="list"
                :model-value="answers[index] === 'si'"
                :default-value="false"
                label="Si"
                @update:model-value="answers[index] = 'si'"
              />
              <UCheckbox
                size="xl"
                variant="list"
                :model-value="answers[index] === 'no'"
                label="No"
                @update:model-value="answers[index] = 'no'"
              />
            </div>
          </div>

          <UButton
            label="Enviar"
            color="primary"
            class="w-full justify-center mt-4"
            @click="submitTest"
          />
        </div>
      </template>
    </UModal>
  </UPageSection>
</template>
