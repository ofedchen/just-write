<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useToast } from "vue-toastification";

  import Popover from "primevue/popover";
  import { useInlogStatus } from "../store/";

  const inlog = useInlogStatus();
  // const toast = useToast();
  const cantVote = ref(false);

  const props = defineProps({
    text: {
      type: Object,
      required: true,
      default: null
    }
  });

  console.log(inlog.user);

  const addRemoveLike = async (id, event) => {
    if (inlog.status) {
      const likes = props.text.likesList;
      const index = likes.indexOf(inlog.user);

      if (index >= 0) likes.splice(index, 1);
      else likes.push(inlog.user);

      try {
        await axios({
          method: "patch",
          url: `/api/publishedTexts/${id}`,
          data: {
            likesList: likes
          }
        });
      } catch (error) {
        console.error("Error sending like", error);
      }
    } else {
      cantVote.value.toggle(event);
    }
  };
</script>

<template>
  <Popover ref="cantVote"
    ><span class="w-20 bg-blue-100 p-4 rounded-lg shadow-lg z-index"
      >Log in to star text</span
    ></Popover
  >
  <figure
    @click="addRemoveLike(text.id, $event)"
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
  </figure>
</template>
