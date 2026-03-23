<template>
  <div>
    <CrimeCard v-for="item in crime" :key="item.cmplnt_num" :crime="item" />
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CrimeCard from '../components/CrimeCard.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: [ 'Black', 'White', 'Asian', 'Hispanic', 'Other' ],
  datasets: [ { data: [40, 20, 12, 8, 2] } ]
})

const chartOptions = ref({
  responsive: true
})
const crime = ref([]);

async function getCrimeData() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/resource/qgea-i56i.json');
    const data = await response.json();
    crime.value = data;
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