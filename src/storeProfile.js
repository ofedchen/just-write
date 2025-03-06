import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const bio = ref("");
    const favoriteAuthors = ref("");
    const favoriteGenres = ref("");
    const favoriteBook = ref("");

    const updateProfile = (data) => {
      bio.value = data.bio;
      favoriteAuthors.value = data.favoriteAuthors;
      favoriteGenres.value = data.favoriteGenres;
    };

    return {
      bio,
      favoriteAuthors,
      favoriteGenres,
      favoriteBook,
      updateProfile
    };
  },
  {
    persist: true
  }
);
