<script>
  export default {
    props: {
      msg: String
    }
  };
</script>

<template>
  <img alt="" src="/assets/fox.jpeg" />
  <p>{{ msg }}</p>
</template>

<style>
  p {
    font-weight: bold;
  }
</style>
