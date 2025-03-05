<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, computed } from "vue";
  // import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  import axios from "axios";
  import { useInlogStatus } from "/src/store/";
  import { useProfileStore } from "/src/storeProfile/";

  const inlog = useInlogStatus();
  const profile = useProfileStore();
  const publishedTexts = ref("");
  const bioText = ref("");
  const authorText = ref("");
  const genreText = ref("");
  const bioSaved = ref(false);

  onMounted(async () => {
    bioSaved.value = true;
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

  const saveBio = () => {
    profile.bio = bioText.value;
    profile.favoriteAuthors = authorText.value;
    profile.favoriteGenres = genreText.value;
    bioSaved.value = true;
  };
  const editBio = () => {
    bioSaved.value = false;
  };
</script>

<template>
  <div class="bg-gray-800 w-full h-50 absolute top-35 left-0">
    <UserIcon class="h-30 w-30 border mt-35 bg-white rounded-full ml-20" />

    <div class="ml-20 mt-10 text-lg">
      <p>{{ inlog.firstname }} {{ inlog.surname }}</p>
    </div>
  </div>

  <form
    class="flex flex-col mt-60 w-50 mb-10"
    @submit.prevent="saveBio"
    action=""
    v-if="!bioSaved"
  >
    <label>Tell us something about yourself </label>
    <input v-model="bioText" class="border border-gray-800" type="text" />
    <label>Favourite author? </label>
    <input v-model="authorText" class="border border-gray-800" type="text" />
    <label>Favourite genre? </label>
    <input v-model="genreText" class="border border-gray-800" type="text" />
    <button class="bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2">
      Save
    </button>
  </form>
  <div v-if="bioSaved" class="flex flex-col mt-60 w-50 mb-10">
    <p class="border-b border-gray-800">{{ profile.bio }}</p>
    <p class="border-b border-gray-800">{{ profile.favoriteAuthors }}</p>
    <p class="border-b border-gray-800">{{ profile.favoriteGenres }}</p>
    <button
      class="bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2"
      @click="editBio"
    >
      Edit Bio
    </button>
  </div>

  <!-- <div>
      <h2>Gillade texter</h2>
      <ol>
        <li />
      </ol>
    </div>

    <RouterLink to="/savedtexts" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
    </RouterLink> -->
</template>
