<template>
  <div>
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
      <select style="padding: 6px 12px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px; background-color: #007bff; color: white;" id="boro" v-model="selectedBoro">
        <option value="">All Boroughs</option>
        <option v-for="b in boroughs" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div style="display:flex; gap:20px; margin-top:16px;">
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
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
}
button.active {
  background: #007bff;
  color: #fff;
  border-color: #0063d1;
}
</style>