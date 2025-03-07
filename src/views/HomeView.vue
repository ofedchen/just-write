<script setup>
  import PromptGenerator from "../components/PromptGenerator.vue";
  import TextField from "../components/TextField.vue";
  import TimerComponent from "../components/TimerComponent.vue";
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import { useInlogStatus } from "../store/";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const textPublished = ref(false);
  const prompts = ref([]);
  const randomPrompt = ref(null);
  const hidden = ref(false);
  const writtenText = ref("");
  const inlog = useInlogStatus();
  const stopTimer = ref(false);
  const elapsedMinutes = ref(0);
  const elapsedSeconds = ref(0);
  const textField = ref(null);

  onMounted(async () => {
    try {
      const response = await axios.get(`/api/randomPrompts`);
      prompts.value = response.data;
      const sessionText =
        JSON.parse(sessionStorage.getItem("savedTexts")) || null;
      if (sessionText) {
        randomPrompt.value = sessionText[0].prompt;
      } else {
        generatePrompt();
      }
    } catch (error) {
      console.error("Error fetching prompts", error);
    }
  });

  function generatePrompt() {
    const index = Math.floor(Math.random() * prompts.value.length);
    randomPrompt.value = prompts.value[index].prompt;
  }

  function hidePromptTimer() {
    hidden.value = true;
  }

  function handleText(userText) {
    writtenText.value = userText;
  }

  const daysWriting = computed(() => {
    if (
      localStorage.getItem("savedTexts") &&
      localStorage.getItem("savedTexts") !== null
    ) {
      const savedTexts = JSON.parse(localStorage.getItem("savedTexts"));
      const days = savedTexts.map((text) => text.date);
      days.push(new Date().toLocaleDateString("se-SV"));
      let counter = 0;
      days.forEach((day, index) => {
        if (index === days.lastIndexOf(day)) counter++;
      });
      return counter;
    }
    return 1;
  });

  function handleStopTimer() {
    stopTimer.value = true;
  }

  function handleTimerStopped({ minutes, seconds }) {
    console.log(
      "Timer stopped with elapsed time:",
      minutes,
      "min",
      seconds,
      "sec"
    );

    if (!inlog.status) {
      const sessionMinutes =
        JSON.parse(sessionStorage.getItem("savedMinutes")) || [];
      sessionMinutes.push(minutes);
      sessionStorage.setItem("savedMinutes", JSON.stringify(sessionMinutes));
      const sessionSeconds =
        JSON.parse(sessionStorage.getItem("savedSeconds")) || [];
      sessionSeconds.push(seconds);
      sessionStorage.setItem("savedSeconds", JSON.stringify(sessionSeconds));
    }

    elapsedMinutes.value = minutes;
    elapsedSeconds.value = seconds;

    inlog.minutes = minutes;
    inlog.seconds = seconds;

    if (inlog.returningUser.action === "") textField.value.f();
  }
</script>

<template>
  <main
    class="grid grid-cols-1 lg:grid-cols-3 gap-4 py-2 px-4 lg:px-[0.5em] lg:mx-4"
  >
    <p
      v-show="!inlog.status"
      class="font-[Special_Elite] text-[18px] text-left w-[80%] lg:w-[60%] text-gray-600 px-4 pb-8 lg:col-span-3"
    >
      Just start writing! Go for two minutes, keep going if you’re in the flow.
      Use the prompt for ideas or close it for more space.
    </p>
    <p
      v-show="inlog.status"
      class="font-[Special_Elite] text-[18px] text-left w-[80] lg:w-[60%] text-gray-600 px-4 py-6 md:pb-8 md:pt-0 lg:col-span-3"
    >
      Hi there, <span class="bg-yellow-300">{{ inlog.user }}</span> and welcome
      to day <span class="font-black text-[20px]">{{ daysWriting }}</span> of
      your writing journey!
    </p>
    <PromptGenerator
      @new-prompt="generatePrompt"
      @hide-prompt="hidePromptTimer"
      :current-prompt="randomPrompt"
      :hidden="hidden"
    >
      <TimerComponent
        :user-started="writtenText"
        :stop-timer="stopTimer"
        @timer-stopped="handleTimerStopped"
      />
    </PromptGenerator>
    <TextField
      :clear-text-field="textPublished"
      :current-prompt="randomPrompt"
      :hidden="hidden"
      ref="textField"
      @text-started="handleText"
      @stop-timer="handleStopTimer"
      :class="hidden ? 'lg:col-span-3' : 'lg:col-span-2 lg:row-span-2'"
    />
  </main>
</template>
