<script setup>
import { ref } from "vue";

const userText = ref("");

const props = defineProps({
    currentPrompt: String
})

function saveText() {
    if (!userText.value.trim()) return;

    const savedText = {
        id: Date.now(),
        prompt: props.currentPrompt,
        text: userText.value,
        date: new Date().toLocaleDateString("se-SV"),
    };

    const storedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
    storedTexts.push(savedText);
    localStorage.setItem("savedTexts", JSON.stringify(storedTexts));
    userText.value = "";
}
</script>

<template>
    <form @submit.prevent="saveText" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <textarea v-model="userText"
                placeholder="Write whatever you want. Your goal is to write for 2 minutes, but don't limit yourself."
                name="userText" rows="10" cols="1"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
      </textarea>
        </div>
        <button type="submit" severity="secondary" label="Save text"
            class="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">
            Save text
        </button>
    </form>
</template>
