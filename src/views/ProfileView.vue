<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, computed } from "vue";
  // import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  import axios from "axios";
  import { useInlogStatus } from "/src/store/";

  const inlog = useInlogStatus();
  const startEdit = ref(false);
  const publishedTexts = ref("");
  console.log(inlog.firstname);

  const editBio = () => {
    startEdit.value = true;
  };

  onMounted(async () => {
    // function to fetch published texts from json
    try {
      const response = await axios.get(`/api/publishedTexts`);
      publishedTexts.value = response.data;

      console.log("publicerade texter" + publishedTexts.value);
      console.log("publicerade texter" + publishedTexts.value[0]);
      const filtered = computed(() => {
        return publishedTexts.value.filter((text) =>
          text.published.likesList().includes(inlog.user)
        );
      });
      console.log(filtered);
    } catch (error) {
      console.error("Error fetching texts", error);
    }
  });
</script>

<template>
  <div class="bg-gray-800 w-full h-50 absolute top-35 left-0">
    <UserIcon class="h-30 w-30 border mt-35 bg-white rounded-full ml-20" />

    <div class="ml-20 mt-10 text-lg">
      <p>{{ inlog.firstname }} {{ inlog.surname }}</p>
    </div>

    <p class="ml-20">Dark Mode</p>
  </div>

  <div
    @click="editBio"
    v-if="!startEdit"
    class="m-auto text-white bg-gray-800 h-50 mt-30 w-50 ml-100 rounded-lg shadow-md p-5"
  >
    Här låter vi användaren skriva en biografi om sig själva
  </div>

  <textarea
    v-if="startEdit"
    class="m-auto bg-gray-100 h-50 mt-30 w-50 ml-100 rounded-lg shadow-md p-5"
  />

  <div>
    <h2>Gillade texter</h2>
    <ol>
      <li />
    </ol>
  </div>

  <RouterLink to="/savedtexts" class="ml-auto">
    <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
  </RouterLink>
</template>
