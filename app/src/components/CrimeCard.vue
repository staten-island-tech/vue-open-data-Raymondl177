<template>
<router-link :to="crimeData" class="card">
<h1>{{ crime.cmplnt_num }}</h1>
<h2>{{ crime.ofns_desc }}</h2>
<h2>{{ crime.boro_nm }}</h2>
<h2>{{ crime.cmplnt_fr_dt }}</h2>
<h2>{{ crime.susp_race }}</h2>
<h2>{{ crime.susp_sex }}</h2>
<h2>{{ crime.susp_age_group }}</h2>
</router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  crime: {
    type: Object,
    required: true
  },
});
const crimeData = computed(() => {
  return `/crime/${props.crime.cmplnt_num}`;
});
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