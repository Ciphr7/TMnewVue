<template>
  <div>
    <v-card class="mt-2 mx-1 px-1" elevation="9">
      <v-container>
        <Origin
          :selectedItem="selectedItem"
          :baseColor="baseColor"
          :color="color"
          :noDataText="noDataText"
          :minLength="minLength"
          :itemText="itemText"
          :item-value="selectedItemValue"
          :label="label"
          @update:selectedItem="updateSelectedItem"
        />

        <Destination
          :selectedItem2="selectedItem2"
          :baseColor="baseColor"
          :color="color"
          :noDataText="noDataText2"
          :minLength="minLength"
          :itemText="itemText2"
          :item-value="selectedItem2 ? String(selectedItem2.value) : null"
          :label="label2"
          @update:selectedItem2="updateSelectedItem2"
          :onUpdateSelectedItem2="updateSelectedItem2"
        />
      

      <div class="px-1 pb-1">
        <v-card-text class="text-center">Trip Options</v-card-text>
        <v-select
          v-model="selectedRoutingMethod"
          :items="r_items"
          filled
          label="Routing Method"
        ></v-select>
        <v-switch
          v-model="borderCheck"
          :label="`Close Borders`"
          color="red"
        ></v-switch>
        <v-switch
          class="py-1 my-1"
          v-model="tollCheck"
          :label="`Avoid Toll`"
          color="red"
        ></v-switch>

        <v-btn @click="testRunTrip"> Run Trip </v-btn>
        {{ this.tresults.TripDistance }}
      </div></v-container>
    </v-card>
  
  </div>
</template>

<script>
//import autoComplete from "./autoComplete.vue"

import { lookUpKey, tmAPIKey } from "./tmAPIKey";
import Origin from "./Origin.vue";
import Destination from "./Destination.vue";

export default {
  components: { Origin, Destination },
  name: "TripDetail",
  mounted() {},

  data() {
    return {
      selectedOrigin: null,
      selectedDestination: null,
      inputValue: "",
     
      origin: "",
      dest: "",
      baseColor: "red",
      color: "red",
      noDataText: "i.e. 19145",
      noDataText2: "i.e. Houston, tx",
      minLength: 3,
      itemText: "text",
      itemText2: "text2",
      itemValue: { value: null },
      label: "Origin",
      label2: "Destination",
      autocompleteItems: [],
      autocompleteItems2: [],
      loading: false,
      searchInput: "",
      searchInput2: "",

      r_items: ["practical", "Shortest", "Interstate"],
      value: false,
      right: true,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
      ],

      borderCheck: false,
      tollCheck: false,
      url: "https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=",
      apikey: lookUpKey,
      dialog: false,
      results: [],
      results2: [],
      selectedItem: null,
      selectedItem2: null,

      timeout: null,

      tresults: [],
      selectedRoutingMethod: "practical",
    };
  },
  computed: {
    selectedItemValue() {
      return this.selectedOrigin ? this.selectedOrigin.value : null;
    },
    selectedItemValue2() {
  return this.selectedDestination ? this.selectedDestination.value : null;
},
  },

  watch: {
    selectedRoutingMethod: function (newValue) {
      // You can add any logic here based on the selected value
      switch (newValue) {
        case "practical":
          this.RoutingMethod = 0; // Update with the appropriate value for 'practical'
          break;
        case "Shortest":
          this.RoutingMethod = 1; // Update with the appropriate value for 'Shortest'
          break;
        case "Interstate":
          this.RoutingMethod = 2; // Update with the appropriate value for 'Interstate'
          break;
        // Add more cases if needed
      }
    },
  },
  methods: {
    updateSelectedItem(newValue) {
      // Handle the updated selected item from the autocomplete component
      this.selectedItem = newValue;
    },
    updateSelectedItem2(newValue2) {
      // Handle the updated selected item from the autocomplete component
      this.selectedItem2 = newValue2;
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },

    testRunTrip() {
      const trip = {
        TripLegs: [
          {
            Address: "",
            City: "",
            State: "",
            PostalCode: "",
            Latitude: this.$store.state.lat,
            Longitude: this.$store.state.lon,
            LocationText: this.selectedItem ? this.selectedItem.text : this.selectedItem =null,
          },
          {
            Address: "",
            City: "",
            State: "",
            PostalCode: "",
            Latitude: "",
            Longitude: "",
            LocationText: this.selectedItem2,
          },
        ],
        UnitMPG: 6,
        RoutingMethod: this.selectedRoutingMethod,
        BorderOpen: this.borderCheck,
        AvoidTollRoads: this.tollCheck,
        VehicleType: 7,
        AllowRelaxRestrictions: false,
        GetDrivingDirections: true,
        GetMapPoints: true,
        GetStateMileage: true,
        GetTripSummary: true,
        GetTruckStopsOnRoute: false,
        GetFuelOptimization: false,
        apikey: tmAPIKey,
      };

      fetch("http://prime.promiles.com/WebAPI/api/RunTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trip),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(this.selectedItem);
          console.log(JSON.stringify(data));
          this.tresults = data;
          this.$store.commit("setTResults", data);
          this.$emit("trip-results", this.tresults);
          console.log(this.selectedRoutingMethod);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>
<style scoped></style>
