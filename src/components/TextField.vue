<script setup>
  import { onMounted, ref } from "vue";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";
  import axios from "axios";

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
    showToast.value = true;

    const sessionText = JSON.parse(sessionStorage.getItem("savedTexts")) || [];
    if (sessionText.length > 0) {
      userText.value = sessionText[0].text;
      inlog.returningUser.status = true;
      if (inlog.returningUser.action === "save") setTimeout(saveText, 800);
      if (inlog.returningUser.action === "publish") {
        setTimeout(publishText, 800);
        setTimeout(saveText, 801);
      }
    } else {
      inlog.returningUser.status = false;
    }
  });

  // SAVE TEXT
  //emiting stop timer to save the writing time to pinia variables
  function stopThenSave() {
    if (!userText.value.trim()) {
      if (showToast.value)
        toast.error("There's nothing to save yet - keep writing!");
      return;
    }
    emit("stopTimer");
  }

  //saving to local storage here
  function saveText() {
    const savedText = {
      id: Date.now(),
      prompt: props.hidden ? "Free writing" : props.currentPrompt,
      text: userText.value,
      date: new Date().toLocaleDateString("en-US"),
      timedMinutes: inlog.minutes,
      timedSeconds: inlog.seconds
    };

    if (inlog.status) {
      if (sessionStorage.getItem("savedMinutes")) {
        savedText.timedMinutes = JSON.parse(
          sessionStorage.getItem("savedMinutes")
        )[0];
        savedText.timedSeconds = JSON.parse(
          sessionStorage.getItem("savedSeconds")
        )[0];
      }
      storedTexts.value = JSON.parse(localStorage.getItem("savedTexts")) || [];
      storedTexts.value.push(savedText);
      localStorage.setItem("savedTexts", JSON.stringify(storedTexts.value));

      sessionStorage.removeItem("savedTexts");
      sessionStorage.removeItem("savedMinutes");
      sessionStorage.removeItem("savedSeconds");

      if (showToast.value)
        toast.success(
          "Your text is now saved! You wrote for " +
            inlog.minutes +
            " minutes and " +
            inlog.seconds +
            " seconds"
        );
      userText.value = "";

      inlog.returningUser.status = false;
      inlog.returningUser.action = "";

      router.push({ path: "/savedtexts" });
    } else {
      const sessionText = [];
      sessionText.push(savedText);
      sessionStorage.setItem("savedTexts", JSON.stringify(sessionText));

      inlog.returningUser.action = "save";
      inlog.returningUser.status = true;

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
        inlog.returningUser.status = false;
        sessionStorage.removeItem("savedTexts");
      } catch (error) {
        console.error("Error publishing text", error);
        toast.error("Text hasn't been published");
      }
    } else {
      const sessionText =
        JSON.parse(sessionStorage.getItem("savedTexts")) || [];
      sessionText.push(savedText);
      sessionStorage.setItem("savedTexts", JSON.stringify(sessionText));

      inlog.returningUser.action = "publish";
      inlog.returningUser.status = true;

      emit("stopTimer");

      router.push({ path: "/login" });
    }
  }

  const emit = defineEmits(["textStarted", "stopTimer"]);

  function checkText() {
    if (userText.value.trim()) {
      emit("textStarted", userText.value);
    }
  }

  defineExpose({ saveText });
</script>

<template>
  <form @submit.prevent="stopThenSave" class="flex flex-col gap-4">
    <textarea
      @input="checkText"
      v-model="userText"
      placeholder="“Small habits, when repeated consistently, lead to remarkable results.” - James Clear"
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
        Publish and save
      </button>
      <button
        type="submit"
        label="Save text"
        class="w-1/2 px-5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-lg cursor-pointer"
      >
        Save text
      </button>
    </div>
  </form>
</template>
