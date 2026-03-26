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

const ageLabels = ['0-17','18-24','25-44','45-64','65+','UNKNOWN','OTHER']

const chartData = ref({
  labels: ageLabels,
  datasets: [
    {
      label: 'Crimes by Suspect Age Group',
      backgroundColor: ['#7b68ee','#87CEEB','#FFD700','#FF7F50','#20B2AA','#C0C0C0','#d3d3d3'],
      data: ageLabels.map(() => 0)
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Crimes by Suspect Age Group' }
  }
}

function mapAgeBuckets(rows) {
  const buckets = {}
  ageLabels.forEach(l => buckets[l.toUpperCase()] = 0)
  rows.forEach(r => {
    const age = (r.susp_age_group || 'OTHER').toString().toUpperCase().trim()
    const count = Number(r.count ?? r['count_cmplnt_num'] ?? r['count'] ?? 0)
    if (buckets[age] !== undefined) {
      buckets[age] += count
    } else {
      buckets.OTHER += count
    }
  })
  return ageLabels.map(l => buckets[l.toUpperCase()] ?? 0)
}

async function loadAgeCounts(boro) {
  try {
    const base = '$select=susp_age_group,count(cmplnt_num) as count&$group=susp_age_group&$limit=50000'
    const where = boro ? `&$where=${encodeURIComponent(`boro_nm='${boro}'`)}` : ''
    const url = `https://data.cityofnewyork.us/resource/qgea-i56i.json?${base}${where}`
    const res = await fetch(url)
    const rows = await res.json()
    const newData = mapAgeBuckets(rows)

    chartData.value = {
      labels: ageLabels,
      datasets: [
        {
          label: boro ? `Crimes by Age — ${boro}` : 'Crimes by Suspect Age Group',
          backgroundColor: ['#7b68ee','#87CEEB','#FFD700','#FF7F50','#20B2AA','#C0C0C0','#d3d3d3'],
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
    console.error('Failed to load age counts:', err)
  }
}

onMounted(() => loadAgeCounts(props.borough))
watch(() => props.borough, (newB) => loadAgeCounts(newB))
</script>

<style scoped>
</style>