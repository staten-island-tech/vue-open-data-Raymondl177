<template>
  <div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const crime = ref([]);

async function getCrimeData() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/api/v3/views/qgea-i56i/query.json');
    data = await response.json();
    crime.value = data.results
  } catch (error) {
    console.error('Error fetching crime data:', error);
  }
}

getCrimeData();
</script>

<style scoped>

</style>