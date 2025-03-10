<script setup>
  import { ref, watch, onMounted } from "vue";
  import { useInlogStatus } from "../store/";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";
  import { useToast } from "vue-toastification";
  import { ExclamationCircleIcon } from "@heroicons/vue/24/solid";
  import { EyeIcon } from "@heroicons/vue/24/solid";

  const router = useRouter();
  const route = useRoute();
  const newUsername = ref("");
  const newPasswordFirst = ref("");
  const newPasswordSecond = ref("");
  const toast = useToast();

  const inlog = useInlogStatus();
  const profileCreated = ref(true);
  const completeInlog = ref("#E2E8F0");
  const completeInlogBoolean = ref(false);
  const borderRedGreen = ref("");
  const borderWidth = ref("1");
  const jsonUserData = ref([]);
  const createAccountFilled = ref(false);
  const createAccountFilledColour = ref("#FFF9C4");
  const termsChecked = ref(false);
  const textColor = ref("");
  const loginError = ref(false);
  const passwordIsVisible = ref(false);
  // const firstname = ref("");
  // const surname = ref("");
  // const errorCreatingProfile = ref(false);

  // Här skapar vi profil

  // skicka data till json

  async function sendUserData() {
    const users = {
      username: newUsername.value,
      password: newPasswordSecond.value
      // firstname: firstname.value,
      // surname: surname.value
    };
    const form = {
      user: newUsername.value,
      firstname: "",
      surname: "",
      profileBio: "",
      profileFavoriteAuthors: "",
      profileFavoriteGenres: "",
      profileFavoriteBook: ""
    };

    try {
      await axios.post(`/api/userInfo`, users);
      await axios.post(`/api/userForm`, form);

      toast.success("You have successfully created a profile");
    } catch (error) {
      console.error("Error creating profile", error);
      toast.error("Profile has not been created");
    }
  }
  // spara användardata även lokalt

  const createProfile = async () => {
    await sendUserData();
    profileCreated.value = true;
  };

  const skipCreate = () => {
    profileCreated.value = true;
  };

  const username = ref("");
  const password = ref("");

  // hämta användardata från json

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userInfo`);
      jsonUserData.value = response.data;
      const foundUser = jsonUserData.value.find(
        (user) =>
          user.username === username.value && user.password === password.value
      );

      if (foundUser) {
        inlog.user = foundUser.username;
        // inlog.firstname = foundUser.firstname;
        // inlog.surname = foundUser.surname;
      }
    } catch (error) {
      console.error("Error fetching userData", error);
    }
  };

  const loginFunction = async () => {
    await fetchUserData();

    const userDataCheck = jsonUserData.value.some(
      (user) =>
        user.username === username.value && user.password === password.value
    );

    if (userDataCheck) {
      inlog.logIn();

      const toPage = route.query.endpoint ? "/savedtexts" : "/";
      router.push({ path: toPage });
    } else {
      loginError.value = true;
    }
  };

  // Logga in del: Kolla så att användarnnamn och lösenord är över 6 tecken

  // ändra så användarnamn inte behöver vara mer än 6 tecken???
  watch([username, password], ([watchUsername, watchPassword]) => {
    if (watchUsername.length >= 6 && watchPassword.length >= 6) {
      completeInlog.value = "#2d3748";
      completeInlogBoolean.value = true;
      textColor.value = "white";
    } else {
      completeInlog.value = "#E2E8F0";
      completeInlogBoolean.value = false;
      textColor.value = "black";
    }
  });

  // Skapa konto del: Kolla så att användarnamn och lösenord är över 6 tecken och att lösenorden är samma.
  watch(
    [newUsername, newPasswordFirst, newPasswordSecond, termsChecked],
    ([checkUsername, checkPasswordFirst, checkPasswordSecond, watchTerms]) => {
      if (
        (checkUsername.length >= 6 &&
          checkPasswordFirst.length >= 6 &&
          checkPasswordFirst === checkPasswordSecond,
        watchTerms)
      ) {
        createAccountFilled.value = true;
        createAccountFilledColour.value = "#FDD835";
      } else {
        createAccountFilled.value = false;
        createAccountFilledColour.value = "#FFF9C4";
      }

      if (checkPasswordFirst && checkPasswordSecond) {
        if (
          checkPasswordFirst === checkPasswordSecond &&
          checkPasswordFirst.length >= 6
        ) {
          borderRedGreen.value = "#166534";
        } else {
          borderRedGreen.value = "#991b1b";
        }
        borderWidth.value = "2px";
      } else {
        borderRedGreen.value = "";
        borderWidth.value = "2px";
      }
    }
  );

  const skipToCreateProfile = () => {
    profileCreated.value = false;
    loginError.value = false;
  };

  const togglePasswordVisibility = () => {
    if (!passwordIsVisible.value) {
      passwordIsVisible.value = true;
    } else if (passwordIsVisible.value) passwordIsVisible.value = false;
  };
</script>

<template>
  <div
    v-if="loginError"
    class="flex items-center m-auto gap-3 border-b border-red-800 bg-red-100 p-4 shadow-md w-md mb-5"
  >
    <ExclamationCircleIcon class="w-8 h-8 text-red-800" />
    <p class="font-medium text-red-800">Invalid username or password</p>
  </div>
  <form
    v-if="profileCreated"
    @submit.prevent="loginFunction"
    class="flex flex-col max-w-md mb-8 space-y-4 m-auto flex"
  >
    <p class="text-blue-800 mb-1">Username</p>

    <input
      type="text"
      name="username"
      id="username"
      placeholder="Username"
      class="w-[80vw] lg:w-full border-b border-gray-400 p-[0.3em] max-w-md mb-8 space-y-4 m-auto outline-none"
      v-model="username"
    />
    <p class="text-blue-800 mb-1">Password</p>

    <div
      class="w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto flex items-center"
    >
      <input
        :type="!passwordIsVisible ? 'password' : 'text'"
        name="password"
        id="password"
        placeholder="Password"
        class="border-b border-gray-400 p-[0.3em] w-full -mr-10 outline-none"
        v-model="password"
      />
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="cursor-pointer"
      >
        <EyeIcon class="w-8 h-8 mb-4" />
      </button>
    </div>

    <button
      class="p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto cursor-pointer"
      :disabled="!completeInlogBoolean"
      :style="{ backgroundColor: completeInlog, color: textColor }"
      v-if="!inlog.status"
    >
      Sign in
    </button>

    <p
      @click="skipToCreateProfile"
      class="text-blue-800 cursor-pointer m-auto mt-8 pr-2 pl-2 mb-50"
    >
      Not yet a member? Create your profile here!
    </p>
  </form>
  <div class="flex place-content-center m-auto">
    <form
      v-if="!profileCreated"
      @submit.prevent="createProfile"
      class="flex flex-col"
    >
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Username
      </p>

      <input
        type="text"
        name="new-username"
        id="new-username"
        placeholder="Enter your new username here"
        class="border-b p-[0.3em] w-[80vw] lg:w-full max-w-md mb-4 space-y-4 m-auto outline-none"
        :class="{
          'border-red-700 border-b-2':
            newUsername.length > 0 && newUsername.length < 6,
          'border-green-800 border-b-2': newUsername.length >= 6
        }"
        v-model="newUsername"
      />
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Password
      </p>

      <div class="w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        <input
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="new-password"
          id="new-password"
          placeholder="Minimum 6 characters"
          :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
          class="border-b border-gray-400 mb-5 p-[0.3em] w-full -mr-10 outline-none"
          v-model="newPasswordFirst"
        />

        <button
          type="button"
          @click="togglePasswordVisibility"
          class="cursor-pointer"
        >
          <EyeIcon class="w-8 h-8 -mb-2" />
        </button>
      </div>
      <p class="text-blue-800 w-[80vw] lg:w-full max-w-md space-y-4 m-auto">
        Password
      </p>

      <div
        class="w-[80vw] lg:w-full max-w-md mb-1 space-y-4 m-auto flex items-center"
      >
        <input
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="repeat-password"
          id="repeat-password"
          placeholder="Enter your password again"
          :style="{ borderColor: borderRedGreen, borderWidth: borderWidth }"
          class="border-b border-gray-400 p-[0.3em] w-full -mr-10 outline-none"
          v-model="newPasswordSecond"
        />

        <button
          type="button"
          @click="togglePasswordVisibility"
          class="cursor-pointer"
        >
          <EyeIcon class="w-8 h-8 mb-4" />
        </button>
      </div>
      <p class="text-gray-600 m-auto text-sm mb-5">
        Password and username must contain atleast 6 characters
      </p>
      <button
        :disabled="!createAccountFilled"
        :style="{ backgroundColor: createAccountFilledColour }"
        class="cursor-pointer p-[0.3em] w-[80vw] lg:w-full max-w-md mb-8 space-y-4 m-auto pr-3 pl-3"
        :class="createAccountFilled ? '' : 'text-gray-700'"
      >
        Sign up!
      </button>

      <p class="m-auto pr-3 pl-3">
        <input type="checkbox" v-model="termsChecked" />
        By continuing, you agree to the Terms of Service, and Privacy Policy.
      </p>

      <p
        @click="skipCreate"
        class="text-blue-800 cursor-pointer m-auto pr-3 pl-3 mb-50"
      >
        Already a member? Sign in here!
      </p>
    </form>
  </div>
</template>
