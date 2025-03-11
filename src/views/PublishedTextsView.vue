<script setup>
  import { computed, onMounted, ref } from "vue";
  import SortAndSearch from "../components/SortAndSearch.vue";
  import TextDisplayed from "../components/TextDisplayed.vue";
  import axios from "axios";

  const publishedTexts = ref([]);
  const expandedText = ref({});
  const searchValue = ref("");
  const sorted = ref(false);
  const searchMonth = ref("");

  onMounted(async () => {
    // function to fetch published texts from json
    try {
      const response = await axios.get(`/api/publishedTexts`);
      publishedTexts.value = response.data.toReversed();
      // setting an Object with texts id as keys and false as default value to show short version of text
      for (const text of publishedTexts.value) {
        expandedText.value[text.id] = false;
      }
    } catch (error) {
      console.error("Error fetching texts", error);
    }
  });

  // function to expand and minimize saved texts
  function readMoreLess(id) {
    expandedText.value[id] = !expandedText.value[id];
  }

  const filtered = computed(() => {
    if (publishedTexts.value.length > 0) {
      return publishedTexts.value.filter((text) => {
        const searchMatch =
          text.prompt.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.text.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          text.date.toLowerCase().includes(searchValue.value.toLowerCase());

        const monthMatch =
          searchMonth.value === "" ||
          text.date.startsWith(searchMonth.value + "/");

        return searchMatch && monthMatch;
      });
    }
    return [];
  });

  const months = computed(() => {
    if (publishedTexts.value.length > 0) {
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const uniqueMonths = new Set(
        publishedTexts.value.map((text) => month[text.date.split("/")[0] - 1])
      );
      return Array.from(uniqueMonths).reverse();
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

  function filterByMonth(month) {
    const monthMap = {
      January: "1",
      February: "2",
      March: "3",
      April: "4",
      May: "5",
      June: "6",
      July: "7",
      August: "8",
      September: "9",
      October: "10",
      November: "11",
      December: "12"
    };
    searchMonth.value = monthMap[month];
    console.log(searchMonth.value);
  }
</script>

<template>
  <h2
    class="text-[1.7em] text-center lg:text-left font-semibold px-15 mb-10 lg:-mt-12"
  >
    Published by community
  </h2>
  <main
    class="grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 lg:px-[0.5em] mx-2 md:mx-4 lg:mx-10"
  >
    <section class="py-8 bg-gray-50 mb-4 lg:col-span-3">
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
    </section>
    <aside class="py-8 bg-gray-50 mb-4">
      <h3 class="py-2 px-4 font-medium text-[1.2em]">Published in 2025</h3>
      <ul class="list-disc list-inside px-2">
        <li
          @click="filterByMonth(month)"
          class="px-4 py-2 text-[1em] text-gray-600 underline underline-offset-2 cursor-pointer"
          v-for="(month, index) in months"
          :key="index"
        >
          {{ month }}
        </li>
      </ul>
      <h4
        class="px-8 py-2 text-[1em] font-medium underline underline-offset-2 cursor-pointer"
        @click="searchMonth = ''"
      >
        All texts
      </h4>
    </aside>
  </main>
</template>
