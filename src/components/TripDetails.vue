<template>
    <div>
      <v-card class="mt-2 mx-1 px-1" elevation="9">
        <v-container fluid>
          <v-row>
            <v-col cols="10">
              <v-switch
                id="SetToCurrentLocation"
                class="py-1"
                color="red"
                v-model="checkbox1"
                :label="`Set Origin to My GPS Location`"
              ></v-switch>
            </v-col>
  
            <v-col cols="1">
              <v-icon class="py-5"> mdi-access-point </v-icon>
            </v-col>
          </v-row>
        </v-container>
  
        <br />
        <br />
        <div class="px-2 my-15">
          <v-card-text>Trip Options</v-card-text>
          <v-select  filled label="Practical"></v-select>
          <v-switch pa-5  :label="`Close Borders`"></v-switch>
          <v-switch
            class="p-0 m-0"
           
            :label="`Avoid Toll`"
          ></v-switch>
          <v-btn > Run Trip </v-btn>
         
          <div></div>
        </div>
      </v-card>
    </div>
  </template>

<script>
import { defineComponent } from '@vue/composition-api'
import { lookUpKey, tmAPIKey } from "./tmAPIKey";
export default ({

  components: {},
  name: "TripDetails",
  data: () => ({
    myPos: null,
    r_items: ["practical", "Shortest", "Interstate"],
    value: false,
    right: true,
    rules: [
      (value) => !!value || "Required.",
      (value) => (value || "").length <= 20 || "Max 20 characters",
    ],
    checkbox1: false,
    checkbox2: true,
    checkbox3: true,
    destinationPos: "",
    url: "https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=",
    apikey: lookUpKey,
    results: [],
    selectedItem: null,
    isVisible: false,
    searchQuery: "",
    Location: [],
    timeout: null,
    debounceMilliseconds: 250,
    tresults: [],
  })

})

</script>
