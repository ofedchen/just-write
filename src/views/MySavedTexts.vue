<script setup>
import { ref, onMounted, computed } from "vue";
import SortSearch from "../components/Sort&Search.vue";
import TextDisplayed from "../components/TextDisplayed.vue";

const savedTexts = ref([]);
const expandedText = ref({});
const searchValue = ref("");
const sorted = ref(false);

onMounted(() => {
  // function to sync saved texts with the local storage
  if (
    localStorage.getItem("savedTexts") &&
    localStorage.getItem("savedTexts") !== null
  ) {
    savedTexts.value = JSON.parse(
      localStorage.getItem("savedTexts")
    ).toReversed();
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

function sortByDate() {
  savedTexts.value.reverse();
  sorted.value = !sorted.value;
}

function onInput(searchTerm) {
  searchValue.value = searchTerm;
}
</script>

<template>
  <SortSearch :sorted="sorted" @sortTexts="sortByDate" @onInput="onInput" />
  <TextDisplayed
    :expandedText="expandedText"
    :texts="filtered"
    @expand="readMoreLess"
  >
    <!-- edit button -->
    <!-- <button class="relative focus:outline-none text-[#FFFFFF]
        bg-gray-800 hover:bg-gray-900 focus:ring-2 font-medium rounded-lg
        text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer">Edit</button> -->
    <!-- ADD Functionality to edit and show short version and expand -->
  </TextDisplayed>
</template>
