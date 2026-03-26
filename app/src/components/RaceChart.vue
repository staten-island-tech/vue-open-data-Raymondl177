<template>
  <div style="height:350px; width: 520px;">
    <Bar
      ref="chartRef"
      v-if="chartData"
      :chart-data="chartData"
      :data="chartData"
      :chart-options="chartOptions"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  borough: { type: String, default: '' }
})

const chartRef = ref(null)

const chartData = ref({
  labels: ['Black', 'White', 'Asian', 'Hispanic', 'Unknown', 'Other'],
  datasets: [
    {
      label: 'Crimes by Suspect Race',
      backgroundColor: ['#2f4f4f', '#87CEEB', '#FFD700', '#FF7F50', '#C0C0C0', '#d3d3d3'],
      data: [0, 0, 0, 0, 0, 0]
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Crimes by Suspect Race' }
  }
}

function mapCountsToBuckets(rows) {
  const buckets = { BLACK: 0, WHITE: 0, ASIAN: 0, HISPANIC: 0, OTHER: 0 }
  rows.forEach(r => {
    const race = (r.susp_race || '').toString().toUpperCase().trim()
    const count = Number(r.count ?? r['count_cmplnt_num'] ?? r['count'] ?? 0)
    if (!race) {
      buckets.OTHER += count
    } else if (race.includes('BLACK')) {
      buckets.BLACK += count
    } else if (race.includes('ASIAN')) {
      buckets.ASIAN += count
    } else if (race.includes('HISPANIC')) {
      buckets.HISPANIC += count
    } else if (race.includes('WHITE')) {
      buckets.WHITE += count
    } else if (race.includes('NULL')) {
      buckets.UNKNOWN += count
    } else {
      buckets.OTHER += count
  })
  return buckets
}

async function loadRaceCounts(boro) {
  try {
    const base = '$select=susp_race,count(cmplnt_num) as count&$group=susp_race&$limit=50000'
    const where = boro ? `&$where=${encodeURIComponent(`boro_nm='${boro}'`)}` : ''
    const url = `https://data.cityofnewyork.us/resource/qgea-i56i.json?${base}${where}`
    const res = await fetch(url)
    const rows = await res.json()
    const buckets = mapCountsToBuckets(rows)
    const newData = [
      buckets.BLACK,
      buckets.WHITE,
      buckets.ASIAN,
      buckets.HISPANIC,
      buckets.UNKNOWN,
      buckets.OTHER
    ]
    chartData.value = {
      labels: ['Black', 'White', 'Asian', 'Hispanic', 'Unknown', 'Other'],
      datasets: [
        {
          label: boro ? `Crimes by Race — ${boro}` : 'Crimes by Suspect Race',
          backgroundColor: ['#2f4f4f', '#87CEEB', '#FFD700', '#FF7F50', '#C0C0C0', '#d3d3d3'],
          data: newData
        }
      ]
    }

    await nextTick()
    if (chartRef.value?.renderChart) {
      chartRef.value.renderChart(chartData.value, chartOptions)
    } else if (chartRef.value?.chart) {
      chartRef.value.chart.data = chartData.value
      chartRef.value.chart.options = chartOptions
      chartRef.value.chart.update()
    }
  } catch (err) {
    console.error('Failed to load race counts:', err)
  }
}

onMounted(() => {
  loadRaceCounts(props.borough)
})

watch(() => props.borough, (newB) => {
  loadRaceCounts(newB)
})
</script>

<style scoped>
.card {
  width: 28%;
  height: 500px;
  background-color: aliceblue;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  text-transform: uppercase;
}
img {
  width: 100%;
  height: 80%;
  object-fit: cover;
}
</style>