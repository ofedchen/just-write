<script setup>
import PromptGenarator from "../components/PromptGenerator.vue";
import Textfield from "../components/Textfield.vue";
import Timer from "../components/Timer.vue";
import { ref, onMounted } from 'vue'
import axios from "axios";

const prompts = ref([]);
const randomPrompt = ref(null);

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


</script>

<template>
  <main class="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 py-4">
    <PromptGenarator @newPrompt="generatePrompt" :currentPrompt="randomPrompt" />
    <Textfield :currentPrompt="randomPrompt" class="md:col-span-2" />
    <Timer />
  </main>
</template>
