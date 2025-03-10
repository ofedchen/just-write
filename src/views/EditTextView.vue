<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useToast } from "vue-toastification";

  const route = useRoute();
  const router = useRouter();

  const textId = Number(route.params.id);
  const editedText = ref("");
  const textData = ref(null);
  const toast = useToast();
  const showToast = ref(true);

  onMounted(() => {
    showToast.value = true;
    const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
    console.log(savedTexts);
    textData.value = savedTexts.find((t) => t.id === textId);
    if (textData.value) {
      editedText.value = textData.value.text;
    } else {
      router.push("/savedtexts"); // If error
    }
  });

  function saveEdit() {
    const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
    const index = savedTexts.findIndex((t) => t.id === textId);
    if (index !== -1) {
      savedTexts[index].text = editedText.value;
      localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
      toast.success("Your changes has been saved");
    }
    router.push("/savedtexts"); // Back to savedtexts after save edit
  }
</script>

<template>
  <div class="flex center flex-col max-w-220 m-auto">
    <textarea
      v-model="editedText"
      rows="13"
      cols="1"
      class="border w-full h-auto p-4 text-[1.1em] text-gray-900 bg-gray-50 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 block"
    />

    <div class="mt-4 flex space-x-2">
      <button
        @click="saveEdit"
        class="w-1/2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer"
      >
        Save changes
      </button>
      <button
        @click="router.push('/savedtexts')"
        class="w-1/2 border border-solid border-gray-400 text-gray px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
