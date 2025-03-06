<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, watch } from "vue";
  // import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  import axios from "axios";
  import { useInlogStatus } from "/src/store/";
  import { useProfileStore } from "/src/storeProfile/";
  import TextDisplayed from "../components/TextDisplayed.vue";

  const inlog = useInlogStatus();
  const profile = useProfileStore();
  const publishedTexts = ref([]);
  const likedTexts = ref([]);
  const expandedText = ref({});
  const bioText = ref("");
  const authorText = ref("");
  const genreText = ref("");
  const bookText = ref("");
  const bioSaved = ref(false);
  const displayLikedTexts = ref(false);

  onMounted(async () => {
    bioSaved.value = true;

    try {
      const response = await axios.get(`/api/publishedTexts`);
      publishedTexts.value = response.data;
      console.log(publishedTexts.value);
    } catch (error) {
      console.error("Error fetching texts", error);
    }
  });

  watch(publishedTexts, (newPublishedTexts) => {
    likedTexts.value = newPublishedTexts.filter((text) =>
      text.likesList.includes(inlog.user)
    );
    console.log("Filtered texts:", likedTexts.value);
  });

  const saveBio = () => {
    profile.bio = bioText.value;
    profile.favoriteAuthors = authorText.value;
    profile.favoriteGenres = genreText.value;
    profile.favoriteBook = bookText.value;

    bioSaved.value = true;
  };
  const editBio = () => {
    bioSaved.value = false;
  };
  function readMoreLess(id) {
    // function to expand and minimize saved texts
    expandedText.value[id] = !expandedText.value[id];
  }

  function showLikedTexts() {
    displayLikedTexts.value = !displayLikedTexts.value;
  }
</script>

<template>
  <div class="bg-gray-800 w-full h-50 absolute top-35 left-0">
    <UserIcon class="h-30 w-30 border mt-35 bg-white rounded-full ml-20" />

    <div class="ml-20 mt-10 text-lg">
      <!-- <p>{{ inlog.firstname }} {{ inlog.surname }}</p> -->
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
    <label>Favourite book? </label>
    <input v-model="bookText" class="border border-gray-800" type="text" />
    <button class="bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2">
      Save
    </button>
  </form>
  <div v-if="bioSaved" class="flex flex-col mt-60 w-50 mb-10">
    <label>About me </label>

    <p class="border-b border-gray-800 p-3">{{ profile.bio }}</p>
    <label>Favourite author? </label>

    <p class="border-b border-gray-800 p-3">{{ profile.favoriteAuthors }}</p>
    <label>Favourite genre? </label>

    <p class="border-b border-gray-800 p-3">{{ profile.favoriteGenres }}</p>
    <label>Favourite book? </label>

    <p class="border-b border-gray-800 p-3">{{ profile.favoriteBook }}</p>

    <button
      class="bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2"
      @click="editBio"
    >
      Edit Bio
    </button>
  </div>

  <button
    @click="showLikedTexts"
    class="text-lg bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2"
  >
    Look at liked texts
  </button>

  <TextDisplayed
    v-if="displayLikedTexts"
    :expanded-text="expandedText"
    :texts="likedTexts"
    @expand="readMoreLess"
  />

  <!-- <RouterLink to="/savedtexts" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
    </RouterLink> -->
</template>
