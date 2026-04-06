<script setup>
  import { ref, computed } from "vue";
  import api from "../api.js";
  import Popover from "primevue/popover";
  import { useInlogStatus } from "../store/";

  const inlog = useInlogStatus();
  const cantVote = ref(false);

  const props = defineProps({
    text: {
      type: Object,
      required: true,
      default: null
    }
  });

  const addRemoveLike = async (id, event) => {
    if (inlog.status) {
      try {
        const response = await api.post(`/texts/${id}/like`);
        props.text.likesList = response.data.likesList;
      } catch (error) {
        console.error("Error toggling like", error);
      }
    } else {
      togglePopover(event);
    }
  };

  const starsCount = computed(() => props.text.likesList.length);

  function togglePopover(event) {
    cantVote.value.toggle(event);
  }
</script>

<template>
  <Popover ref="cantVote" @click="togglePopover"
    ><span class="w-20 bg-yellow-200 p-4 rounded-lg shadow-lg z-10"
      >Log in to star text</span
    ></Popover
  >
  <figure
    @click="addRemoveLike(text.id, $event)"
    class="flex flex-col items-center px-1"
  >
    <div
      :class="[
        text.likesList.includes(inlog.user) ? 'bg-yellow-400' : 'bg-gray-50',
        'flex items-center justify-center w-8 h-8 rounded-full cursor-pointer'
      ]"
    >
      <i
        :class="
          text.likesList.includes(inlog.user) ? 'pi pi-star-fill' : 'pi pi-star'
        "
      />
    </div>
    <figcaption>{{ starsCount }}</figcaption>
  </figure>
</template>
