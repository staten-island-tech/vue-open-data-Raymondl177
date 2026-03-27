<template>
  <div style="height:520px; width:900px; background:#181818; padding:16px; border-radius:8px; margin:auto;">
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
      // brighter palette for dark background
      backgroundColor: ['#FF6B6B', '#4D9DE0', '#FFD166', '#06D6A0', '#845EC2', '#C9CBCF'],
      data: [0, 0, 0, 0, 0, 0]
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: '#ffffff', usePointStyle: true } },
    title: { display: true, text: 'Crimes by Suspect Race', font: { size: 20 }, color: '#ffffff' },
    tooltip: { titleColor: '#ffffff', bodyColor: '#ffffff', backgroundColor: '#222' }
  },
  scales: {
    x: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255,255,255,0.06)' }
    },
    y: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255,255,255,0.06)' }
    }
  }
}

function mapCountsToBuckets(rows) {
  const buckets = { BLACK: 0, WHITE: 0, ASIAN: 0, HISPANIC: 0, UNKNOWN: 0, OTHER: 0 }
  if (!Array.isArray(rows)) return buckets
  rows.forEach(r => {
    const race = (r.susp_race || '').toString().toUpperCase().trim()
    const count = Number(r.count ?? r['count_cmplnt_num'] ?? r['count'] ?? 0) || 0

    if (!race || race === 'NULL' || race === '(NULL)' || race === 'UNKNOWN') {
      buckets.UNKNOWN += count
    } else if (race.includes('HISPANIC')) {
      buckets.HISPANIC += count
    } else if (race.includes('BLACK')) {
      buckets.BLACK += count
    } else if (race.includes('ASIAN')) {
      buckets.ASIAN += count
    } else if (race.includes('WHITE')) {
      buckets.WHITE += count
    } else {
      buckets.OTHER += count
    }
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
    console.log('RaceChart: rows', rows)

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
          backgroundColor: ['#FF6B6B', '#4D9DE0', '#FFD166', '#06D6A0', '#845EC2', '#C9CBCF'],
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
    } else {
      console.warn('RaceChart: chartRef not ready', chartRef.value)
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
/* keep container centered when used standalone */
div { display: block; margin: 0 auto; }
</style>