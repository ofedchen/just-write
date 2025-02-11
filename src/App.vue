<script>
  import CitiesList from "./components/CitiesList.vue";
  import HelloWorld from "./components/HelloWorld.vue";

  export default {
    components: {
      CitiesList,
      HelloWorld
    }
  };
</script>

<template>
  <HelloWorld msg="Hello World!" />
  <CitiesList />
</template>
