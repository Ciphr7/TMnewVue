<template>
  
  <GMapMap
      :center="center"
      :zoom="4"
      map-type-id="terrain"
      style=" width: 100%; height: 650px"
  >
    <GMapCluster>
      <GMapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center=m.position"
      />
    </GMapCluster>
  </GMapMap>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      center: {lat: 39.8282, lng: -98.5795},
      markers: [
        {
          position: {
            lat: 39.8282, lng: -98.5795
          },
        }
        , // Along list of clusters
      ]
    }
  }
}
</script>

<style>
.map-container {
  height: 100%; /* Adjust the height as needed */
  overflow: hidden; 
}
</style>