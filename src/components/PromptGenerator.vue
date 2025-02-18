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
 <div v-show="!hidden">
  <h2 class="text-xl">Random Prompt</h2>
  <span class="text-lg p-8 cursor-pointer" @click="hidePrompt">&#x2715</span>
  <p>{{ randomPrompt }}</p>
  <button @click="generatePrompt">Change prompt</button>
</div>
</template>

<style></style>
