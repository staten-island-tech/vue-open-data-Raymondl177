<template>
  <div>
<h2>{{ crime?.id }}</h2>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const crime = ref(null)

async function getCrime(id) {
  console.log('did i run?')
  const response = await fetch(`https://data.cityofnewyork.us/api/v3/views/qgea-i56i/query.json?pageNumber=1&pageSize=10&app_token=Tk1R8rAIISpls9I6N2pgFsEmC&query=SELECT%20*%20WHERE%20%60cmplnt_num%60%3D'${id}'`)
  const data = await response.json()
  crime.value = data
}
watch(
  () => route.params.id,
  function (id) {
    getCrime(id)
  },
)
onMounted(function () {
  getCrime(route.params.id)
})
</script>

<style scoped>

</style>