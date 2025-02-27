<script setup>
  import { ref, onMounted, computed } from "vue";
  import SortAndSearch from "../components/SortAndSearch.vue";
  import TextDisplayed from "../components/TextDisplayed.vue";

  const publishedTexts = ref([]);
  const expandedText = ref({});
  const searchValue = ref("");
  const sorted = ref(false);

  onMounted(() => {
    // function to fetch published texts from json

    // setting an Object with texts id as keys and false as default value to show short version of text
    for (const text of publishedTexts.value) {
      expandedText.value[text.id] = false;
    }
  });

  function readMoreLess(id) {
    // function to expand and minimize saved texts
    expandedText.value[id] = !expandedText.value[id];
  }

  const filtered = computed(() => {
    return publishedTexts.value.filter(
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
  <SortAndSearch
    :sorted="sorted"
    @sort-texts="sortByDate"
    @on-input="onInput"
  />
  <TextDisplayed
    :expanded-text="expandedText"
    :texts="filtered"
    @expand="readMoreLess"
  />
</template>
