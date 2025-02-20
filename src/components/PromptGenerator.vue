<script setup>
import { ref, onMounted, computed } from "vue";

import axios from "axios";

const prompts = ref([]);
const randomPrompt = ref("");
const hidden = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/randomPrompts");
    prompts.value = response.data;
    console.log(prompts.value);
  } catch (error) {
    console.error("Error fetching prompts", error);
  }

  generatePrompt();

});

function generatePrompt() {
  const index = Math.floor(Math.random() * prompts.value.length);
  randomPrompt.value = prompts.value[index].prompt;
}

function hidePrompt() {
  hidden.value = true
}

</script>

<template>
  <div v-show="!hidden" class="relative">
    <h2 class="text-xl">Random Prompt</h2>
    <span class="text-lg p-8 cursor-pointer absolute -top-8 right-0" @click="hidePrompt">&#x2715</span>
    <p class="py-8">{{ randomPrompt }}</p>
    <button @click="generatePrompt"
      class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Change
      prompt</button>
  </div>
</template>

<style></style>
