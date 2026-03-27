<template style="background:#181818;">
  <div style="min-height:100vh; background:#181818; color:#ffffff; padding:24px; display:flex; flex-direction:column; align-items:center;">
    <div style="display:flex; gap:12px; align-items:center;">
      <button
        :class="{ active: selectedChart === 'race' }"
        @click="selectedChart = 'race'"
      >
        Race Chart
      </button>
      <button
        :class="{ active: selectedChart === 'age' }"
        @click="selectedChart = 'age'"
      >
        Age Chart
      </button>

      <label for="boro" style="margin-left:16px;">Select borough:</label>
      <select id="boro" v-model="selectedBoro" style="background:#282828; color:#fff; border:1px solid #444; padding:6px; border-radius:4px;">
        <option value="">All Boroughs</option>
        <option v-for="b in boroughs" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div style="display:flex; justify-content:center; width:100%; margin-top:16px;">
      <component
        :is="selectedComponent"
        v-if="selectedComponent"
        :borough="selectedBoro"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RaceChart from '@/components/RaceChart.vue'
import AgeChart from '@/components/AgeChart.vue'

const boroughs = ['MANHATTAN','BRONX','BROOKLYN','QUEENS','STATEN ISLAND']
const selectedBoro = ref('')
const selectedChart = ref('race')

const selectedComponent = computed(() =>
  selectedChart.value === 'age' ? AgeChart : RaceChart
)
</script>

<style scoped>
button {
  padding: 6px 12px;
  border: 1px solid #444;
  background: #282828;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
button.active {
  background: #06D6A0;
  color: #000;
  border-color: #06D6A0;
}
</style>