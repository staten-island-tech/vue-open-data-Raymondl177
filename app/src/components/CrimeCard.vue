<template>
  <div>
<h1>{{ data.title }}</h1>
<h2>{{ data.description }}</h2>
<router-link :to="`/crime/${data.id}`">View Details</router-link>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>