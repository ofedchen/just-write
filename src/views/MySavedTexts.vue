<script setup>
  import { ref, onMounted, computed } from "vue";
  import SortAndSearch from "../components/SortAndSearch.vue";
  import TextDisplayed from "../components/TextDisplayed.vue";
  // import { useInlogStatus } from "../store/";

  const savedTexts = ref([]);
  const expandedText = ref({});
  const searchValue = ref("");
  const sorted = ref(false);
  // const inlog = useInlogStatus();

  onMounted(() => {
    // function to sync saved texts with the local storage
    if (
      localStorage.getItem("savedTexts") &&
      localStorage.getItem("savedTexts") !== null
    ) {
      savedTexts.value = JSON.parse(
        localStorage.getItem("savedTexts")
      ).toReversed();
      console.log(savedTexts.value);
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
  <main class="mx-6 lg:mx-12">
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
    <!-- <TimerComponent @timer-stopped="handleTimerStopped" /> -->
  </main>
</template>
