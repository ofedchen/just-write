<script setup>
import { ref } from "vue";

const userText = ref("");

function saveText() {
  if (!newText.value.trim()) return;

  const savedText = {
    id: Date.now(),
    text: newText.value,
    date: new Date().toLocaleDateString("se-SV"),
  };

  const storedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
  storedTexts.push(savedText);
  savedEntries.value = storedTexts;
  localStorage.setItem("savedTexts", JSON.stringify(storedTexts));
  newText.value = "";
}
</script>

<template>
  <form @submit.prevent="saveText" class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <textarea
        v-model="userText"
        placeholder="Write whatever you want. Your goal is to write for 2 minutes, but don't limit yourself."
        name="userText"
        rows="10"
        cols="1"
      >
      </textarea>
    </div>
    <button type="submit" severity="secondary" label="Save text"></button>
  </form>
</template>
