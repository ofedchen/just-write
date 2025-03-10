<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, watch } from "vue";
  // import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  import { useToast } from "vue-toastification";

  import axios from "axios";
  import { useInlogStatus } from "/src/store/";
  // import { useProfileStore } from "/src/storeProfile/";
  import TextDisplayed from "../components/TextDisplayed.vue";

  const inlog = useInlogStatus();
  const toast = useToast();
  // const profile = useProfileStore();
  const publishedTexts = ref([]);
  const likedTexts = ref([]);
  const expandedText = ref({});
  const firstname = ref("");
  const surname = ref("");
  const bioText = ref("");
  const authorText = ref("");
  const genreText = ref("");
  const bookText = ref("");
  // const bioSaved = ref(false);
  const userInput = ref([]);
  const foundUserInput = ref(false);
  const filterUserInput = ref([]);
  const id = ref("");

  watch(publishedTexts, (newPublishedTexts) => {
    likedTexts.value = newPublishedTexts.filter((text) =>
      text.likesList.includes(inlog.user)
    );
  });

  const editBio = () => {
    foundUserInput.value = false;

    firstname.value = filterUserInput.value[0].firstname;
    surname.value = filterUserInput.value[0].surname;
    bioText.value = filterUserInput.value[0].profileBio;
    authorText.value = filterUserInput.value[0].profileFavoriteAuthors;
    genreText.value = filterUserInput.value[0].profileFavoriteGenres;
    bookText.value = filterUserInput.value[0].profileFavoriteBook;
  };
  function readMoreLess(id) {
    // function to expand and minimize saved texts
    expandedText.value[id] = !expandedText.value[id];
  }

  // Skicka användarens input

  // Hämta och logga användardata för att säkerställa att den finns

  async function sendUserForm() {
    const form = {
      user: inlog.user,
      firstname: firstname.value,
      surname: surname.value,
      profileBio: bioText.value,
      profileFavoriteAuthors: authorText.value,
      profileFavoriteGenres: genreText.value,
      profileFavoriteBook: bookText.value
    };
    foundUserInput.value = true;

    id.value = filterUserInput.value[0].id;
    try {
      await axios({
        method: "patch",
        url: `/api/userForm/${id.value}`,
        data: form
      });
    } catch (error) {
      console.error("Error filling form", error);
      toast.error("User form has not been filled");
    }
  }
  // hämta användarens input
  const fetchUserForm = async () => {
    try {
      const response = await axios.get(`/api/userForm`);
      userInput.value = response.data;

      filterUserInput.value = userInput.value.filter((input) =>
        input.user.includes(inlog.user)
      );

      if (filterUserInput.value > 0) {
        foundUserInput.value = true;
      }
    } catch (error) {
      console.error("Error fetching userForm", error);
    }
  };

  onMounted(async () => {
    foundUserInput.value = true;

    await fetchUserForm();

    try {
      const response = await axios.get(`/api/publishedTexts`);
      publishedTexts.value = response.data;
    } catch (error) {
      console.error("Error fetching texts", error);
    }
  });

  const saveBio = async () => {
    await sendUserForm();
    await fetchUserForm();
  };
</script>

<template>
  <div>
    <form
      class="flex flex-col w-50 mb-10"
      @submit.prevent="sendUserForm"
      action=""
      v-if="!foundUserInput"
    >
      <label>Firstname </label>
      <input v-model="firstname" class="border border-gray-800" type="text" />
      <label>Surname </label>
      <input v-model="surname" class="border border-gray-800" type="text" />
      <label>Tell us something about yourself </label>
      <input v-model="bioText" class="border border-gray-800" type="text" />
      <label>Favourite author? </label>
      <input v-model="authorText" class="border border-gray-800" type="text" />
      <label>Favourite genre? </label>
      <input v-model="genreText" class="border border-gray-800" type="text" />
      <label>Favourite book? </label>
      <input v-model="bookText" class="border border-gray-800" type="text" />
      <button
        @click="saveBio"
        class="bg-gray-800 mt-2 text-white cursor-pointer rounded-sm p-2"
      >
        Save
      </button>
    </form>
    <div
      v-if="foundUserInput && filterUserInput.length > 0"
      class="flex flex-col w-60 mb-10 bg-gray-100 bg-gray-800 text-white p-5 rounded-lg"
    >
      <UserIcon class="h-30 w-30 rounded-full m-auto" />

      <p
        class="text-xl m-auto font-bold font-[Special_Elite] text-gray-900 bg-yellow-300 flex flex-row"
      >
        {{ filterUserInput[0].firstname || "" }}
        {{ filterUserInput[0].surname || "" }}
      </p>
      <label>About me </label>

      <p class="border-gray-800 p-3">
        {{ filterUserInput[0].profileBio || "" }}
      </p>
      <label>Favourite author? </label>

      <p class="border-gray-800 p-3">
        {{ filterUserInput[0].profileFavoriteAuthors || "" }}
      </p>
      <label>Favourite genre? </label>

      <p class="border-gray-800 p-3">
        {{ filterUserInput[0].profileFavoriteGenres || "" }}
      </p>
      <label>Favourite book? </label>

      <p class="border-gray-800 p-3">
        {{ filterUserInput[0].profileFavoriteBook || "" }}
      </p>

      <button
        class="bg-white mt-2 text-gray-800 cursor-pointer rounded-sm p-2"
        @click="editBio"
      >
        Edit Bio
      </button>
    </div>

    <TextDisplayed
      :expanded-text="expandedText"
      :texts="likedTexts"
      @expand="readMoreLess"
    />

    <!-- <RouterLink to="/savedtexts" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
    </RouterLink> -->
  </div>
</template>
<!--
<style scoped>
  label {
    color: darkblue;
  }
</style> -->
