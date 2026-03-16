<template>
  <div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const crime = ref(null)

async function getCrime(id) {
  console.log('did i run?')
  const response = await fetch(`https://data.cityofnewyork.us/resource/qgea-i56i.json?id=${id}`)
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