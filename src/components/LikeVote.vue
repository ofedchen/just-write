<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useToast } from "vue-toastification";

  import Message from "primevue/message";
  import { useInlogStatus } from "../store/";

  const inlog = useInlogStatus();
  const toast = useToast();
  // const likeInfo = ref(null);
  const cantVote = ref(null);

  const props = defineProps({
    text: {
      type: Object,
      required: true,
      default: null
    }
  });

  console.log(inlog.user);

  const addRemoveLike = async (id) => {
    console.log("addRemove");
    if (inlog.status) {
      console.log("logged in");
      const likes = props.text.likesList;
      const index = likes.indexOf(inlog.user);
      console.log(index);

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
      cantVote.value = true;
      toast.info("Log in to vote");
    }
  };
</script>

<template>
  <Message v-if="cantVote" severity="info">Log in to rate text</Message>
  <figure
    @click="addRemoveLike(text.id)"
    :class="
      text.likesList.includes(inlog.user) ? 'bg-yellow-400' : 'bg-gray-50'
    "
  >
    <i
      :class="text.likesList.includes(inlog.user) ? 'pi-star-fill' : 'pi-star'"
    />
  </figure>
</template>
