<template>
  <v-app>
    <v-app-bar
      :style="{ 'z-index': 1 }"
      class="bg-red-lighten-1 white--text d-flex justify-center text-center"
      app
    >
      <v-toolbar-title>TruckMiles <span>&reg;</span></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <google-map />
    </v-main>
    <footerVue></footerVue>
  </v-app>
</template>

<script setup>
import footerVue from "./components/footer.vue";
import GoogleMap from "./components/GoogleMap.vue";
</script>
