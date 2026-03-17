<template>
  <div>
<h1>{{ props.data.title }}</h1>
<h2>{{ props.data.description }}</h2>
<router-link :to="crimeData">View Details</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});
const crimeData = computed(() => {
  return `/crime/${props.id}`;
});
</script>

<style scoped>

</style>