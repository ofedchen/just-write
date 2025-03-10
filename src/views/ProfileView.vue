<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, watch } from "vue";
  // import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  import { useToast } from "vue-toastification";

  import axios from "axios";
  import { useInlogStatus } from "/src/store/";
  import TextDisplayed from "../components/TextDisplayed.vue";

  const inlog = useInlogStatus();
  const toast = useToast();
  const publishedTexts = ref([]);
  const likedTexts = ref([]);
  const expandedText = ref({});
  const firstname = ref("");
  const surname = ref("");
  const bioText = ref("");
  const authorText = ref("");
  const genreText = ref("");
  const bookText = ref("");
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

      if (filterUserInput.value.length > 0) {
        foundUserInput.value = true;
        firstname.value = filterUserInput.value[0].firstname;
        surname.value = filterUserInput.value[0].surname;
        bioText.value = filterUserInput.value[0].profileBio;
        authorText.value = filterUserInput.value[0].profileFavoriteAuthors;
        genreText.value = filterUserInput.value[0].profileFavoriteGenres;
        bookText.value = filterUserInput.value[0].profileFavoriteBook;
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
  <div class="flex flex-col lg:flex-row gap-15 sm:items-center lg:items-start">
    <form
      class="flex flex-col sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 rounded-lg min-h-130 max-h-180"
      @submit.prevent="sendUserForm"
      action=""
      v-if="!foundUserInput"
    >
      <label>Firstname </label>
      <input
        v-model="firstname"
        class="border p-3 border-gray-800"
        type="text"
      />
      <label>Surname </label>
      <input v-model="surname" class="border border-gray-800" type="text" />
      <label>Tell us something about yourself </label>
      <textarea v-model="bioText" class="border border-gray-800" type="text" />
      <label>My favourite author? </label>
      <input v-model="authorText" class="border border-gray-800" type="text" />
      <label>My favourite genre? </label>
      <input v-model="genreText" class="border border-gray-800" type="text" />
      <label>My favourite book? </label>
      <input v-model="bookText" class="border border-gray-800" type="text" />
      <button
        @click="saveBio"
        class="bg-gray-800 mt-2 text-xl text-white cursor-pointer rounded-sm p-2"
      >
        Save
      </button>
    </form>
    <div
      v-if="foundUserInput && filterUserInput.length > 0"
      class="flex flex-col sm:w-2/3 md:w-2/3 lg:w-1/3 bg-gray-100 bg-gray-800 text-white p-8 rounded-lg min-h-130 max-h-180"
    >
      <UserIcon class="h-40 w-40 rounded-full m-auto" />

      <p
        class="text-2xl m-auto font-bold font-[Special_Elite] text-gray-900 bg-yellow-300 mt-2 mb-2 flex flex-row"
      >
        {{ filterUserInput[0].firstname || "" }}
        {{ filterUserInput[0].surname || "" }}
      </p>

      <p class="text-md font-bold text-white break-words shadow-lg p-8">
        {{ filterUserInput[0].profileBio || "" }}
      </p>
      <label>My favourite author: </label>

      <p class="text-lg font-semibold text-black bg-gray-200 p-2">
        {{ filterUserInput[0].profileFavoriteAuthors || "" }}
      </p>
      <label>My favourite genre: </label>

      <p class="text-lg font-semibold text-black bg-gray-200 p-2">
        {{ filterUserInput[0].profileFavoriteGenres || "" }}
      </p>
      <label>My favourite book </label>

      <p class="text-lg font-semibold text-black bg-gray-200 p-2">
        {{ filterUserInput[0].profileFavoriteBook || "" }}
      </p>

      <button
        class="bg-white mt-5 text-xl text-gray-800 cursor-pointer transition duration-300 hover:bg-gray-300 rounded-sm p-2"
        @click="editBio"
      >
        Edit Bio
      </button>
    </div>
    <div class="flex flex-col justify-start w-3/3 lg:w-2/3">
      <h2
        class="text-3xl m-auto font-bold font-[Special_Elite] text-white bg-gray-800"
        v-if="likedTexts.length > 0"
      >
        My Favourite Texts
      </h2>
      <TextDisplayed
        :expanded-text="expandedText"
        :texts="likedTexts"
        @expand="readMoreLess"
      />

      <!-- <RouterLink to="/savedtexts" class="ml-auto">
      <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
    </RouterLink> -->
    </div>
  </div>
</template>

<style scoped>
  label {
    font-weight: bold;
    margin-bottom: 4px;
    margin: 1vh;
  }

  input {
    padding: 8px;
    border: 2px solid #1f2937;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease-in-out;
  }

  input:focus {
    border-color: #facc15; /* Tailwind yellow-400 */
    outline: none;
    box-shadow: 0 0 5px rgba(250, 204, 21, 0.6);
  }

  form > label {
    color: #1f2937;
  }
</style>
