<script setup>
import { ref } from "vue";

const newUsername = ref("");
const newPassword = ref("");

const userData = ref([]);
const profileCreated = ref(false);
const logedIn = ref(false);

const createProfile = () => {
  userData.value.push({
    choosenName: newUsername,
    choosenPassword: newPassword,
  });
  profileCreated.value = true;
  console.log(userData.value);
};
// console.log(userData);

const username = ref("");
const password = ref("");

const loginFunction = () => {
  const userDataCheck = userData.value.some(
    (user) =>
      user.choosenName === username.value &&
      user.choosenPassword === password.value
  );

  if (userDataCheck) {
    logedIn.value = true;
    console.log("Användare är inloggad");
  }
};

// username.value === userData.value[0].choosenName &&
//     password.value === userData.value[0].choosenPassword
</script>

<template>
  <h1>Skapa ett konto</h1>
  <form v-if="!profileCreated" @submit.prevent="createProfile">
    <input
      type="text"
      name=""
      id=""
      placeholder="Skriv in nytt användarnamn"
      class="rounded-md border bg-yellow-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-model="newUsername"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Skriv in nytt lösenord"
      class="rounded-md border bg-tellow-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-model="newPassword"
    />

    <button class="bg-red-500">Nytt konto</button>
  </form>

  <form v-if="profileCreated" @submit.prevent="loginFunction">
    <input
      type="text"
      name=""
      id=""
      placeholder="Användarnamn"
      class="rounded-md border border-gray-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-model="username"
    />
    <input
      type="password"
      name=""
      id=""
      placeholder="Lösenord"
      class="rounded-md border border-gray-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-model="password"
    />
    <button
      class="rounded-md border bg-gray-400 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-if="!logedIn"
    >
      Logga in</button
    ><button
      class="rounded-md border bg-green-800 p-[0.3em] w-72 md:w-1/2 mb-8 lg:-mt-19"
      v-if="logedIn"
    >
      Inloggad
    </button>
    <p>
      By continuing, you agree to the Terms of Sale, Terms of Service, and
      Privacy Policy.
    </p>
  </form>
</template>
