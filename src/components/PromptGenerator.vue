<script setup>
import { ref } from "vue";

const hidden = ref(false)

defineProps({
  currentPrompt: String
})

const emit = defineEmits(['newPrompt'])

const newPrompt = () => {
  emit('newPrompt')
}

function hidePrompt() {
  hidden.value = true
}

</script>

<template>
  <div v-show="!hidden" class="relative">
    <h2 class="text-xl">Random Prompt</h2>
    <span class="text-lg p-8 cursor-pointer absolute -top-8 right-0" @click="hidePrompt">&#x2715</span>
    <p class="py-8">{{ currentPrompt }}</p>
    <button @click="newPrompt"
      class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Change
      prompt</button>
  </div>
</template>

<style></style>
