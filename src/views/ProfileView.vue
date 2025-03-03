<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { UserIcon } from "@heroicons/vue/24/solid";
  // import axios from "axios";

  import { useInlogStatus } from "/src/store/";

  const inlog = useInlogStatus();
  const userInfo = ref("");
  const startEdit = ref(false);

  console.log(inlog.firstname);

  const editBio = () => {
    startEdit.value = true;
  };
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

  <RouterLink to="/savedtexts" class="ml-auto">
    <h2 class="font-[Overpass] text-[20px]">My saved writings</h2>
  </RouterLink>
</template>
