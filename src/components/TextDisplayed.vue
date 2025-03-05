<script setup>
  import LikeVote from "../components/LikeVote.vue";
  import { useRoute, useRouter } from "vue-router";

  const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
  };

  const router = useRouter();

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

    // totalElapsedMin: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    // totalElapsedSec: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // }
  });

  const emit = defineEmits(["expand"]);

  function expand(id) {
    emit("expand", id);
  }

  function goToEdit(id) {
    router.push(`/edit/${id}`);
  }
</script>

<template>
  <article
    :class="[
      'container px-4 py-4',
      isActiveLink('/published')
        ? 'grid grid-cols-[40px_1fr] grid-rows-[auto]'
        : ''
    ]"
    v-for="text in texts"
    :key="text.id"
  >
    <div
      v-if="!isActiveLink('/savedtexts')"
      class="row-span-4 place-items-start"
    >
      <LikeVote :text="text" />
    </div>
    <h2 class="font-[Overpass] text-[1.2em] font-semibold">
      <span>{{ text.prompt }} </span>
    </h2>
    <h3 class="text-gray-600">Date: {{ text.date }}</h3>
    <h3 v-if="!isActiveLink('/published')" class="text-gray-600">
      Time Writing: {{ text.timedMinutes }} min {{ text.timedSeconds }} sec
    </h3>
    <h3 v-if="text.name">Author: {{ text.name }}</h3>
    <div v-if="!expandedText[text.id]">
      <p class="w-full py-4">
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
      <p class="w-full py-4 col-span-2">{{ text.text }}</p>
      <button
        @click="expand(text.id)"
        class="underline bg-yellow-400 hover:bg-yellow-500 font-medium text-[1.05em] me-2 mb-2 cursor-pointer"
      >
        Close
      </button>
    </div>
    <!-- Edit-button, navigates to EditTextView -->
    <button
      v-if="!isActiveLink('/published' && '/profile')"
      @click="goToEdit(text.id)"
      class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900"
    >
      Edit
    </button>
  </article>
</template>
