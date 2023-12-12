<template>
  <v-app>
    <v-main>
      <v-app-bar class="bg-red white--text d-flex justify-center text-center" app>
        <v-toolbar-title 
          >TruckMiles
          <span >&reg;</span></v-toolbar-title
        >
      </v-app-bar>
     <google-map />
     <footerVue></footerVue>
    </v-main>
  </v-app>
</template>

<script setup>
  import footerVue from './components/footer.vue';
  import GoogleMap from './components/GoogleMap.vue';

  
</script>
