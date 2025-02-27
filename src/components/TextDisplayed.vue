<script setup>
  defineProps({
    texts: {
      type: Array,
      required: true,
      default: null
    },
    expandedText: {
      type: Object,
      required: true,
      default: null
    }
  });

  const emit = defineEmits(["expand"]);

  function expand(id) {
    emit("expand", id);
  }
</script>

<template>
  <div
    class="container mx-6 lg:mx-12 px-4 py-4"
    v-for="text in texts"
    :key="text.id"
  >
    <h2 class="font-[Overpass] text-[1.2em] font-semibold">
      <span>{{ text.prompt }} </span>
    </h2>
    <h3>Date: {{ text.date }}</h3>
    <div v-if="!expandedText[text.id]">
      <p class="w-full max-w-[80%] py-4">
        {{
          text.text.length > 150 ? text.text.slice(0, 150) + "..." : text.text
        }}
      </p>
      <!-- read more button -->
      <button
        v-if="text.text.length > 150"
        @click="expand(text.id)"
        class="underline bg-yellow-400 hover:bg-yellow-500 font-medium text-[1.05em] me-2 mb-2 cursor-pointer"
      >
        Read more
      </button>
    </div>

    <!-- close read more -->
    <div v-if="expandedText[text.id]">
      <p class="w-full max-w-[80%] py-4">{{ text.text }}</p>
      <button
        @click="expand(text.id)"
        class="underline bg-yellow-400 hover:bg-yellow-500 font-medium text-[1.05em] me-2 mb-2 cursor-pointer"
      >
        Close
      </button>
    </div>
    <slot />
  </div>
</template>
