<script setup>
  import { ref } from "vue";

  defineProps({
    sorted: Boolean
  });

  const searchValue = ref("");

  const emit = defineEmits(["sortTexts", "onImput"]);

  const sortTexts = () => {
    emit("sortTexts");
  };

  const onInput = () => {
    emit("onInput", searchValue.value);
  };
</script>

<template>
  <div
    class="container mx-6 lg:mx-12 flex flex-wrap gap-4 justify-start items-center w-full lg:-mt-2 lg:w-3/5 mb-8"
  >
    <div class="cursor-pointer p-4">
      <i class="pi pi-sort-alt" style="font-size: 1rem" @click="sortTexts">
        <span class="font-medium font-sans font-stretch-50%" v-show="!sorted">
          Sorted: newest first</span
        >
        <span class="font-medium font-sans font-stretch-50%" v-show="sorted">
          Sorted: oldest first</span
        >
      </i>
    </div>
    <input
      @input="onInput"
      type="text"
      name="search"
      id=""
      v-model="searchValue"
      placeholder="Search here"
      class="rounded-md border border-gray-400 p-[0.3em] block mx-4 w-3/4"
    />
  </div>
</template>
