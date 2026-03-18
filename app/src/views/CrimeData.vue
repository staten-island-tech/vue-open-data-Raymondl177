<template>
  <div>
<div>
    <div v-if="crime">
      <h2>{{ crime.cmplnt_num }}</h2>
      <p>{{ crime.ofns_decs }}</p>
      <p>{{ crime.boro_nm }}</p>
      <p>{{ crime.cmplnt_fr_dt }}</p>
      <p>{{ crime.susp_race }}</p>
      <p>{{ crime.susp_sex }}</p>
      <p>{{ crime.susp_age_group }}</p>
    </div>
    <div v-else>Loading...</div>
  </div>
<router-link :to="'/'">Go Back</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const crime = ref(null)

async function getCrime(cmplnt_num) {
  console.log('did i run?')
  const response = await fetch(`https://data.cityofnewyork.us/api/v3/views/qgea-i56i/query.json?pageNumber=1&pageSize=10&app_token=Tk1R8rAIISpls9I6N2pgFsEmC&query=SELECT%20*%20WHERE%20%60cmplnt_num%60%3D'${cmplnt_num}'`)
  const data = await response.json()
  crime.value = data
}
watch(
  () => route.params.cmplnt_num,
  function (cmplnt_num) {
    getCrime(cmplnt_num)
  },
)
onMounted(function () {
  getCrime(route.params.cmplnt_num)
})
</script>

<style scoped>

</style>