<script setup>
import PromptGenarator from "../components/PromptGenerator.vue";
import Textfield from "../components/Textfield.vue";
import Timer from "../components/Timer.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useInlogStatus } from "../store/";

const prompts = ref([]);
const randomPrompt = ref(null);
const hidden = ref(false);
const inlog = useInlogStatus();

onMounted(async () => {
  try {
    const response = await axios.get(`/api/randomPrompts`);
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

function hidePromptTimer() {
  hidden.value = true;
}

const writtenText = ref("");

function handleText(userText) {
  writtenText.value = userText;
}
</script>

<template>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4 px-4 lg:px-[0.5em] lg:mx-4">
    <PromptGenarator @newPrompt="generatePrompt" @hidePrompt="hidePromptTimer" :currentPrompt="randomPrompt"
      :hidden="hidden">
      <Timer :userStarted="writtenText" />
    </PromptGenarator>
    <Textfield :currentPrompt="randomPrompt" :hidden="hidden" @textStarted="handleText"
      :class="hidden ? 'lg:col-span-3' : 'lg:col-span-2 lg:row-span-2'" />
  </main>
</template>
