<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";

  const route = useRoute();
  const router = useRouter();

  const textId = Number(route.params.id);
  const editedText = ref("");
  const textData = ref(null);

  console.log(textId);

  onMounted(() => {
    const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
    console.log(savedTexts);
    textData.value = savedTexts.find((t) => t.id === textId);
    console.log(textData.value);
    if (textData.value) {
      editedText.value = textData.value.text;
      console.log(editedText.value);
    } else {
      // router.push("/savedtexts"); // If error
    }
  });

  function saveEdit() {
    const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
    const index = savedTexts.findIndex((t) => t.id === textId);
    if (index !== -1) {
      savedTexts[index].text = editedText.value;
      localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
    }
    router.push("/savedtexts"); // Back to savedtexts after save edit
  }
</script>

<!-- använd samma writing component som för home -->
<template>
  <div class="container mx-auto max-w-lg py-10">
    <h2 class="text-2xl font-semibold">Edit Text</h2>
    <textarea v-model="editedText" class="border w-full h-40 p-2 mt-4" />

    <div class="mt-4 flex space-x-2">
      <button
        @click="saveEdit"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <button
        @click="router.push('/savedtexts')"
        class="bg-gray-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
