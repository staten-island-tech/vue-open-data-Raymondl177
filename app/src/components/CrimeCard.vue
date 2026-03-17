<template>
  <div>
<router-link :to="crimeData">
<h1>{{ props.data.id }}</h1>
<h2>{{ props.data.ofns_decs }}</h2>
<h2>{{ props.data.boro_nm }}</h2>
<h2>{{ props.data.cmplnt_fr_dt }}</h2>
<h2>{{ props.data.susp_race }}</h2>
<h2>{{ props.data.susp_sex }}</h2>
<h2>{{ props.data.susp_age_group }}</h2>
</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});
const crimeData = computed(() => {
  return `/crime/${props.id}`;
});
</script>

<style scoped>

</style>