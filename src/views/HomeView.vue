<script setup>
  import PromptGenarator from "../components/PromptGenerator.vue";
  import TextField from "../components/TextField.vue";
  import TimerComponent from "../components/TimerComponent.vue";
  import { ref, onMounted, watch } from "vue";
  import axios from "axios";
  // import { useInlogStatus } from "../store/";
  import { useToast } from "vue-toastification";

  const prompts = ref([]);
  const randomPrompt = ref(null);
  const hidden = ref(false);
  // const inlog = useInlogStatus();

  const toast = useToast();

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

  async function publishText() {
    const newText = {
      id: Date.now(),
      text: writtenText.value,
      date: new Date().toLocaleDateString("se-SV")
    };

    try {
      const response = await axios.post(`/api/publishedTexts`, newText);
      // router.push(`/published`);
      toast.success("Your text has been published successfully");
    } catch (error) {
      console.error("Error publishing text", error);
      toast.error("Text hasn't been published");
    }
  }
</script>

<template>
  <p class="font-[Special_Elite] text-[14px] text-center w-md text-gray-600">
    “Small habits, when repeated consistently, lead to remarkable results.” -
    James Clear
  </p>
  <main
    class="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4 px-4 lg:px-[0.5em] lg:mx-4"
  >
    <PromptGenarator
      @new-prompt="generatePrompt"
      @hide-prompt="hidePromptTimer"
      :current-prompt="randomPrompt"
      :hidden="hidden"
    >
      <TimerComponent :user-started="writtenText" />
    </PromptGenarator>
    <TextField
      :current-prompt="randomPrompt"
      :hidden="hidden"
      @text-started="handleText"
      :class="hidden ? 'lg:col-span-3' : 'lg:col-span-2 lg:row-span-2'"
    />
    <button @click="publishText">Publish</button>
  </main>
</template>
