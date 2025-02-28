<script setup>
  import { ref, onMounted, computed } from "vue";
  import SortAndSearch from "../components/SortAndSearch.vue";
  import TextDisplayed from "../components/TextDisplayed.vue";
  import axios from "axios";

  const publishedTexts = ref([]);
  const expandedText = ref({});
  const searchValue = ref("");
  const sorted = ref(false);

  onMounted(async () => {
    // function to fetch published texts from json
    try {
      const response = await axios.get(`/api/publishedTexts`);
      publishedTexts.value = response.data.toReversed();
      console.log(publishedTexts.value);
      // setting an Object with texts id as keys and false as default value to show short version of text
      for (const text of publishedTexts.value) {
        expandedText.value[text.id] = false;
      }
    } catch (error) {
      console.error("Error fetching texts", error);
    }
  });

  function readMoreLess(id) {
    // function to expand and minimize saved texts
    expandedText.value[id] = !expandedText.value[id];
  }

  const filtered = computed(() => {
    if (publishedTexts.value.length > 0) {
      return publishedTexts.value.filter(
        (text) =>
          text.prompt.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.author.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.text.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.date.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    }
    return [];
  });

  function sortByDate() {
    publishedTexts.value.reverse();
    sorted.value = !sorted.value;
  }

  function onInput(searchTerm) {
    searchValue.value = searchTerm;
  }
</script>

<template>
  <h2
    class="text-[1.7em] text-center lg:text-left font-semibold px-15 mb-12 lg:-mt-12"
  >
    Published by community
  </h2>
  <main>
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
  </main>
</template>
