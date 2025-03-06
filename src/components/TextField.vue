<script setup>
  import { defineExpose, ref, onMounted } from "vue";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { nextTick } from "vue";

  import { useInlogStatus } from "../store/";

  const userText = ref("");
  const storedTexts = ref(null);
  const inlog = useInlogStatus();
  const router = useRouter();
  const toast = useToast();
  const showToast = ref(true);

  const props = defineProps({
    currentPrompt: {
      type: String,
      default: null
    },
    hidden: Boolean,
    clearTextField: Boolean
  });

  onMounted(() => {
    const sessionText = JSON.parse(sessionStorage.getItem("savedTexts")) || [];
    // inlog.minutes = JSON.parse(sessionStorage.getItem("savedMinutes")) || null;
    // inlog.seconds = JSON.parse(sessionStorage.getItem("savedSeconds")) || null;
    if (sessionText.length > 0) {
      userText.value = sessionText[0].text;
      inlog.userReturned = true;
      // sessionStorage.removeItem("savedTexts");
      // sessionStorage.removeItem("savedMinutes");
      // sessionStorage.removeItem("savedSeconds");
    }
    console.log("min", inlog.minutes, "sec", inlog.seconds);

    showToast.value = true;
  });

  // SAVE TEXT
  function saveText() {
    if (!userText.value.trim()) {
      if (showToast.value)
        toast.error("There's nothing to save yet - keep writing!");
      return;
    }
    emit("stopTimer");
  }

  function f() {
    console.log(inlog.minutes, inlog.seconds, inlog.status);

    console.log("creating saved text");
    const savedText = {
      id: Date.now(),
      prompt: props.hidden ? "Free writing" : props.currentPrompt,
      text: userText.value,
      date: new Date().toLocaleDateString("en-US"),
      timedMinutes: inlog.minutes,
      timedSeconds: inlog.seconds
    };

    console.log(savedText);

    if (inlog.status) {
      savedText.timedMinutes =
        JSON.parse(sessionStorage.getItem("savedMinutes"))[0] || inlog.minutes;
      savedText.timedSeconds =
        JSON.parse(sessionStorage.getItem("savedSeconds"))[0] || inlog.seconds;
      storedTexts.value = JSON.parse(localStorage.getItem("savedTexts")) || [];
      storedTexts.value.push(savedText);
      localStorage.setItem("savedTexts", JSON.stringify(storedTexts.value));

      sessionStorage.removeItem("savedTexts");
      sessionStorage.removeItem("savedMinutes");
      sessionStorage.removeItem("savedSeconds");

      if (showToast.value) toast.success("Your text is now saved!");
      userText.value = "";

      inlog.userReturned = false;

      router.push({ path: "/savedtexts" });
    } else {
      const sessionText = [];
      sessionText.push(savedText);
      console.log(sessionText);
      sessionStorage.setItem("savedTexts", JSON.stringify(sessionText));

      router.push({ path: "/login" });
    }
  }

  //PUBLISH TEXT
  async function publishText() {
    showToast.value = false;

    if (!userText.value.trim()) {
      toast.error("There's nothing to publish!");
      return;
    }
    const savedText = {
      name: inlog.user,
      prompt: props.hidden ? "Free writing" : props.currentPrompt,
      text: userText.value,
      date: new Date().toLocaleDateString("en-US"),
      likesList: []
    };
    if (inlog.status) {
      try {
        const response = await axios.post(`/api/publishedTexts`, savedText);
        toast.success("Your text has been published successfully");

        router.push({ path: "/published" });
        inlog.userReturned = false;
        sessionStorage.removeItem("savedTexts");
      } catch (error) {
        console.error("Error publishing text", error);
        toast.error("Text hasn't been published");
      }
    } else {
      emit("stopTimer");

      const sessionText =
        JSON.parse(sessionStorage.getItem("savedTexts")) || [];
      sessionText.push(savedText);
      sessionStorage.setItem("savedTexts", JSON.stringify(sessionText));

      router.push({ path: "/login" });
    }
  }

  const emit = defineEmits(["textStarted", "stopTimer"]);

  function checkText() {
    if (userText.value.trim()) {
      emit("textStarted", userText.value);
    }
  }

  function clearAll() {
    sessionStorage.removeItem("savedTexts");
    userText.value = "";
    inlog.userReturned = false;
  }

  defineExpose({ f });
</script>

<template>
  <form @submit.prevent="saveText" class="flex flex-col gap-4">
    <textarea
      @input="checkText"
      v-model="userText"
      placeholder="Just start writing — anything at all. Aim for two minutes, and if you get into the flow, keep going!"
      name="userText"
      rows="13"
      cols="1"
      class="block p-4 w-full text-[1.1em] text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    />
    <div class="flex flex-row gap-4">
      <button
        @click="publishText"
        class="w-1/2 px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded-lg cursor-pointer"
      >
        Publish
      </button>
      <button
        type="submit"
        label="Save text"
        class="w-1/2 px-5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-lg cursor-pointer"
      >
        Save text
      </button>
    </div>
    <div
      v-if="inlog.userReturned"
      @click="clearAll"
      class="cursor-pointer flex items-center"
    >
      <p class="underline underline-offset-2 text-sm">Clear text</p>
      <i class="pi pi-times text-sm px-2" />
    </div>
  </form>
</template>
