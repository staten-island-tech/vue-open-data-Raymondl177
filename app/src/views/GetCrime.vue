<template>
  <div>
    <CrimeCard v-for="item in crime" :key="item.id" :data="item" />
    <router-link to="/">Back to Crime List</router-link>
    
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CrimeCard from '../components/CrimeCard.vue';

const crime = ref([]);

async function getCrimeData() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/resource/qgea-i56i.json');
    data = await response.json();
    crime.value = data.results
  } catch (error) {
    console.error('Error fetching crime data:', error);
  }
}
onMounted(() => {
  getCrimeData();
});


</script>

<style scoped>

</style>