<script setup>
import { ref, onMounted, computed } from 'vue';

import axios from "axios";

const prompts = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/randomPrompts')
    prompts.value = response.data;
    console.log(prompts.value)
  } catch (error) {
    console.error('Error fetching prompts', error)
  }
})

function generatePrompt() {
  const index = Math.floor(Math.random() * prompts.value.length)
  return prompts.value[index]
}


</script>

<template>
  <h1 class='text-2xl'>Just write</h1>
  <p>{{ randomPrompt }}</p>
  <button @click="generatePrompt">Change prompt</button>
</template>

<style></style>
