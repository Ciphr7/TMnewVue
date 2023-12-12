<template>
  <v-sheet darken padless class="blue lighten-1">
    <v-navigation-drawer location="left" class="pa-2" v-model="Drawer1">
      <v-list-item class="white--text d-flex justify-center">
        <v-container>
        <v-img aspect-ratio="2.5" src="../assets/logo.png"></v-img>
        </v-container>
        <v-list-item-title class="text-h6 white--text d-flex justify-center">
          Trip Planner
        </v-list-item-title>
        <v-list-item-subtitle class="white--text d-flex justify-center">
          New Trip - Going today?
        </v-list-item-subtitle>
      </v-list-item>
      
      <v-divider class="red lighten-1"></v-divider>
     
     <trip-details />

    </v-navigation-drawer>

    <v-navigation-drawer
      class="pa-2"
      right
      color="dark"
      v-model="Drawer2"
      app
      location="right"
    >
      <v-list-item class="white--text d-flex justify-center">
        <v-container>
          <v-img src="../assets/logo.png" aspect-ratio="2.5"> </v-img>
        </v-container>
        <v-list-item-title class="text-h6 white--text d-flex justify-center">
          Trip Summary
        </v-list-item-title>
        <v-list-item-subtitle class="white--text d-flex justify-center">
          Trip route detailes
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider class="red lighten-1"></v-divider>

      <v-card class="px-2" elevation="9">
        <v-text-field
          label="input label"
          :rules="rules"
          hide-details="auto"
          class="px-2"
        ></v-text-field>
      </v-card>
    </v-navigation-drawer>
    
    <v-card class="mx-auto my-3" color="red" width="70%">
      <v-footer>
        <v-card-text class="d-flex justify-center">
          <v-btn>
            <v-icon @click="Drawer1 = !Drawer1"> mdi-home </v-icon>
          </v-btn>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon class="mx-auto" size="24px" @click="Drawer2 = !Drawer2">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>
        <section>
          
          
          
          <v-card-text class="white--text d-flex justify-center">
            <strong>TruckMiles<span >&reg;</span><span >-</span></strong>{{ new Date().getFullYear() }}
          </v-card-text>
          <v-card-text class="white--text pt-1 d-flex justify-center">
            Powered by ProMiles <span >&copy;</span>
          </v-card-text></section>
      </v-footer>
    </v-card>
  </v-sheet>
</template>

<script>

import TripDetails from './TripDetails.vue';

export default {
  components: {TripDetails},
  name: "Footer",
  data: () => ({
    Drawer2: false,
    Drawer1: true,
    r_items: ["practical", "Shortest", "Interstate"],

    right: true,
    rules: [
      (value) => !!value || "Required.",
      (value) => (value || "").length <= 20 || "Max 20 characters",
    ],
    icons: ["mdi-truck", "mdi-map", "mdi-check"],
  }),
};
</script>
<style></style>
