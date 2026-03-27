<template>
  <div style="height:520px; width:900px; background:#181818; padding:16px; border-radius:8px; margin:auto;">
    <Pie
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
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

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
      // colorful palette for pie slices
      backgroundColor: ['#FF8A65', '#FFCC80', '#FFF176', '#AED581', '#81D4FA', '#BDBDBD', '#9E9E9E'],
      data: ageLabels.map(() => 0)
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: '#ffffff' } },
    title: { display: true, text: 'Crimes by Suspect Age Group', font: { size: 20 }, color: '#ffffff' },
    tooltip: { titleColor: '#ffffff', bodyColor: '#ffffff', backgroundColor: '#222' }
  }
}

function normalizeAge(raw) {
  if (!raw) return 'UNKNOWN'
  const a = raw.toString().trim().toUpperCase()
  if (a === 'NULL' || a === '(NULL)' || a === 'UNKNOWN' || a === '') return 'UNKNOWN'
  if (['0-17','18-24','25-44','45-64','65+'].includes(a.replace(/\s+/g,''))) {
    return a.replace(/\s+/g,'')
  }
  const range = a.match(/\d+\s*-\s*\d+/)
  if (range) {
    const normalized = range[0].replace(/\s+/g,'')
    if (['0-17','18-24','25-44','45-64'].includes(normalized)) return normalized
    if (/^65/.test(normalized)) return '65+'
  }
  if (a.includes('65')) return '65+'
  if (a.includes('UNKNOWN')) return 'UNKNOWN'
  return 'OTHER'
}

function mapAgeBuckets(rows) {
  const buckets = {}
  ageLabels.forEach(l => buckets[l.toUpperCase()] = 0)
  if (!Array.isArray(rows)) return ageLabels.map(l => 0)
  rows.forEach(r => {
    const raw = r.susp_age_group
    const key = normalizeAge(raw)
    const count = Number(r.count ?? r['count_cmplnt_num'] ?? r['count'] ?? 0) || 0
    const up = key.toUpperCase()
    if (buckets[up] !== undefined) buckets[up] += count
    else buckets['OTHER'] += count
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
    console.log('AgeChart rows:', rows)

    const newData = mapAgeBuckets(rows)

    chartData.value = {
      labels: ageLabels,
      datasets: [
        {
          label: boro ? `Crimes by Age — ${boro}` : 'Crimes by Suspect Age Group',
          backgroundColor: ['#FF8A65', '#FFCC80', '#FFF176', '#AED581', '#81D4FA', '#BDBDBD', '#9E9E9E'],
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
      console.warn('AgeChart: chartRef not ready', chartRef.value)
    }
  } catch (err) {
    console.error('Failed to load age counts:', err)
  }
}

onMounted(() => loadAgeCounts(props.borough))
watch(() => props.borough, (newB) => loadAgeCounts(newB))
</script>

<style scoped>
/* ensure component centers inside parent */
div { display:block; margin:0 auto; }
</style>