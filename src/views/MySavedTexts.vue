<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";

const savedTexts = ref([]);
const expandedText = ref({});
const searchValue = ref("");

onMounted(() => {
  // function to sync saved texts with the local storage
  if (
    localStorage.getItem("savedTexts") &&
    localStorage.getItem("savedTexts") !== null
  ) {
    savedTexts.value = JSON.parse(localStorage.getItem("savedTexts")).toReversed();
  }

  // setting an Object with texts id as keys and false as default value to show short version of text
  for (const text of savedTexts.value) {
    expandedText.value[text.id] = false;
  }
});

function readMoreLess(id) {
  // function to expand and minimize saved texts
  expandedText.value[id] = !expandedText.value[id];
}

const filtered = computed(() => {
  return savedTexts.value.filter(
    (text) =>
      text.prompt.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      text.text.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      text.date.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});
</script>

<template>
  <input type="text" name="" id="" v-model="searchValue" placeholder="Search here"
    class="rounded-md border border-gray-400 p-[0.3em] block m-auto w-72 md:w-1/2 mb-8 lg:-mt-19" />
  <div class="container mx-auto px-4 py-4" v-for="text in filtered">
    <h2 class="font-[Overpass] text-[18px] font-semibold">
      <span>{{ text.prompt }} </span>
    </h2>
    <h3>Date: {{ text.date }}</h3>
    <div v-if="!expandedText[text.id]">
      <p class="w-full max-w-[80%] py-4">{{ text.text.length > 150 ? (text.text.slice(0, 150) + "...") : text.text }}</p>
      <!-- read more button -->
      <button v-if="text.text.length > 150" @click="readMoreLess(text.id)" class="underline bg-yellow-400 hover:bg-yellow-500 font-medium text-sm me-2 mb-2 cursor-pointer">
        Read more
      </button>
    </div>

    <!-- close read more -->
    <div v-if="expandedText[text.id]">
      <p class="w-full max-w-[80%] py-4">{{ text.text }}</p>
      <button @click="readMoreLess(text.id)" class="underline bg-yellow-400 hover:bg-yellow-500 font-medium text-sm me-2 mb-2 cursor-pointer">
        Close
      </button>
    </div>

    <!-- edit button -->
    <!-- <button class="relative focus:outline-none text-[#FFFFFF]
        bg-gray-800 hover:bg-gray-900 focus:ring-2 font-medium rounded-lg
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Edit</button> -->
    <!-- ADD Functionality to edit and show short version and expand -->
  </div>
</template>
