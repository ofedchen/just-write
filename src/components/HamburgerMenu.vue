<script setup>
  import { ref } from "vue";
  import { useInlogStatus } from "/src/store/";
  import { useRouter } from "vue-router";

  const isMenuOpen = ref(false);
  const router = useRouter();
  const inlog = useInlogStatus();

  defineProps({
    isActiveLink: {
      type: Function,
      default: null
    }
  });

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
  }

  const logOutFunction = () => {
    inlog.logOut();
    router.push("/");
  };
</script>

<template>
  <nav>
    <div>
      <button
        @click="toggleMenu"
        class="cursor-pointer m-4 absolute top-20 right-5"
      >
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      class="flex flex-col absolute z-1 bg-gray-800 text-white p-4 top-35 right-5"
    >
      <!-- <RouterLink to="/login" class="ml-0" @click="toggleMenu">
        <h2
          class="font-[Overpass] text-[20px] text-left flex hover:bg-gray-200 hover:text-gray-800 p-1"
          v-if="!inlog.status"
        > -->
      <!-- (före inlogg) -->
      <!-- Profile
        </h2>
      </RouterLink> -->
      <RouterLink
        v-show="!isActiveLink('/')"
        to="/"
        class="ml-0"
        @click="toggleMenu"
      >
        <h2
          class="font-[Overpass] text-[18px] hover:bg-gray-200 hover:text-gray-800 p-1"
        >
          Writing prompt
        </h2>
      </RouterLink>
      <RouterLink to="/published" class="ml-0" @click="toggleMenu">
        <h2
          class="font-[Overpass] text-[18px] hover:bg-gray-200 hover:text-gray-800 p-1"
        >
          Published by community
        </h2>
      </RouterLink>
      <RouterLink
        :to="
          inlog.status
            ? '/savedtexts'
            : { path: '/login', query: { endpoint: 'savedtexts' } }
        "
        class="ml-0"
        @click="toggleMenu"
      >
        <h2
          class="font-[Overpass] text-[18px] hover:bg-gray-200 hover:text-gray-800 p-1"
        >
          My saved writings
        </h2>
      </RouterLink>
      <p v-if="inlog.status" class="mt-10 text-yellow-400">
        Welcome {{ inlog.user }}!
      </p>
      <RouterLink
        v-if="inlog.status"
        to="/profile"
        class="ml-0"
        @click="toggleMenu"
      >
        <h2
          class="font-[Overpass] text-[18px] text-left flex hover:bg-gray-200 hover:text-gray-800 p-1"
        >
          Profile
        </h2>
      </RouterLink>
      <button
        v-if="inlog.status"
        @click="logOutFunction"
        class="bg-white mt-4 text-gray-800 hover:bg-gray-100 rounded-lg p-1.5 cursor-pointer"
      >
        Log out
      </button>
      <RouterLink to="/login" class="m-auto" @click="toggleMenu">
        <button
          v-if="!inlog.status"
          @click="logOutFunction"
          class="bg-white mt-6 font-medium text-gray-800 hover:bg-gray-200 rounded-lg py-2 px-8 cursor-pointer"
        >
          Log in
        </button>
      </RouterLink>
      <!-- published router link -->
    </div>
  </nav>
</template>
