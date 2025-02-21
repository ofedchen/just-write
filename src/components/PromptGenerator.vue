<script setup>
import { watch } from 'vue';


defineProps({
  currentPrompt: String,
  hidden: Boolean
})

const emit = defineEmits(['newPrompt', 'hidePrompt'])

const newPrompt = () => {
  emit('newPrompt')
}

const hidePrompt = () => {
  emit('hidePrompt')
}

</script>

<template>
  <div v-show="!hidden" class="relative px-4 py-8 bg-gray-50/50 rounded-lg border border-gray-300">
    <h2 class="font-[Overpass] text-[18px] font-semibold">Random Prompt</h2>
    <span class="p-8 cursor-pointer absolute -top-3 right-0" @click="hidePrompt">&#x2715</span>
    <p class="py-8">{{ currentPrompt }}</p>
    <button @click="newPrompt"
      class="focus:outline-none text-[#212427] bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Change
      prompt</button>
  </div>
</template>

<style></style>
