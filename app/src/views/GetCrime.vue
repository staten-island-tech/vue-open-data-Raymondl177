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
const crime = ref([]);
  const blackCount = ref(0)
  const whiteCount = ref(0)
  const asianCount = ref(0)
  const hispanicCount = ref(0)
  const otherCount = ref(0)
function updateChartData (){
  crime.value.forEach(item => {
    if (item.susp_race.includes('BLACK')) {
      blackCount.value++
    }
    else if (item.susp_race.includes('WHITE')) {
      whiteCount.value++
    }
    else if (item.susp_race.includes('ASIAN')) {
      asianCount.value++
    }
    else if (item.susp_race.includes('HISPANIC')) {
      hispanicCount.value++
    }
    else {
      otherCount.value++
    }
  })
}
updateChartData();
const chartData = ref({
  labels: [ 'Black', 'White', 'Asian', 'Hispanic', 'Other' ],
  datasets: [ { data: [blackCount.value, whiteCount.value, asianCount.value, hispanicCount.value, otherCount.value] } ]
})

const chartOptions = ref({
  responsive: true
})

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