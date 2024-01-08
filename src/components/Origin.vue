<template>
  <div>
    <v-container>
      <section >
        <v-row>
          <v-col>
            <v-switch
              id="SetToCurrentLocation"
              class="py-1"
              color="red"
              v-model="gpsCheck"
              :label="`Set Origin to My GPS Location`"
            ></v-switch>
          </v-col>

          <v-icon :class="{ 'theme--dark': newValue }" :color="iconColor">
            mdi-access-point
          </v-icon>
        </v-row>
      </section>
    </v-container>

    <v-autocomplete
  v-if="!gpsCheck"
  v-model="localSelectedItem"
  :base-color="baseColor"
  :color="color"
  :no-data-text="noDataText"
  :items="autocompleteItems"
  :loading="loading"
  :search-input="searchInput"
  @update:search-input="val => searchInput = val"
  :min-length="minLength"
  @input="onAutocompleteChange"
  :item-text="itemText"
  :item-value="itemValue ? String(itemValue) : null"
  :label="label"
  @update:selectedItem="updateSelectedItem"
></v-autocomplete>

    <div v-else>
      
      <div>Using Coordinates as Origin: {{ this.$store.state.lat }}, {{ this.$store.state.lon }}</div>
      <!-- Use this info as needed -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      default: null,
    },
    baseColor: {
      type: String,
      default: "red",
    },
    color: {
      type: String,
      default: "red",
    },
    noDataText: {
      type: String,
      default: "i.e. 19145",
    },
    minLength: {
      type: Number,
      default: 3,
    },
    itemText: {
      type: String,
      default: "text",
    },
    itemValue: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: "Origin",
    },
  },
  data() {
    return {
      gpsCheck: false,
      newValue: null,
      autocompleteItems: [],
      loading: false,
      searchInput: "",
      origin: "", // Add this line if origin is used in the template
      localSelectedItem: null,
    };
  },
  computed: {
    iconColor() {
      // Calculate the color based on the value of gpsCheck
      return this.gpsCheck ? "red" : "white";
    },
  },
  watch: {
    gpsCheck: function (newValue) {
      if (newValue) {
       // this.$root.$on("lat", this.lat);
        //this.$root.$on("lon", this.lon);
        console.log("gpsCheck:", newValue);
        this.$store.state.lon = "";
        
        this.setOriginToCurrentLocation();
      } else {
        // Don't forget to remove the event listener to avoid memory leaks
       // this.$root.$off("lat", this.lat);
      //  this.$root.$off("lon", this.lon);
        this.$store.state.lat = "";
        this.$store.state.lon = "";
       // this.localSelectedItem = "";
        this.searchInput = "";
      }

      // Emit an event to notify the parent when localSelectedItem changes
      this.$emit("update:selectedItem", this.localSelectedItem);
    },
    localSelectedItem(newValue) {
      // Emit an event to notify the parent when localSelectedItem changes
      this.$emit("update:selectedItem", newValue);
    },
    selectedItem(newValue) {
      // Update localSelectedItem when the prop changes
      this.localSelectedItem = newValue;
    },
    searchInput(newSearchInput) {
      if (
        newSearchInput &&
        newSearchInput.length >= this.minLength &&
        !this.gpsCheck
      ) {
        this.onAutocompleteChange();
      }
    },
  },
  methods: {
    updateSelectedItem(newValue) {
      // Handle the updated selected item from the autocomplete component
      this.$emit("update:selectedItem", newValue);
      //this.selectedItem = null;
      this.searchInput = "";
      this.localSelectedItem = null;
    },
    setOriginToCurrentLocation() {
      if (navigator.geolocation) {
        var options = {
          maximumAge: 0,
          timeout: 30000,
          enableHighAccuracy: true,
        };
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            this.$store.commit("setLat", lat);
            this.$store.commit("setLon", lon);

            // Emit lat and lon events if needed
            this.$emit("lat", this.lat);
            this.$emit("lon", this.lon);
          },
          (error) => {
            console.warn(`ERROR(${error.code}): ${error.message}`);
          },
          [options]
        );
      } else {
        alert("User did not allow access to GPS location");
      }
    },
    onAutocompleteChange: async function (item) {
      // 'item' contains the selected item
      if (item) {
        this.origin = item.text;
      } else {
        this.origin = ""; // Handle the case when no item is selected
      }

      // The rest of your code remains the same
      this.loading = true;

      try {
        const response = await fetch(
          `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${this.searchInput}&apikey=bU03MSs2UjZIS21HMG5QSlIxUTB4QT090`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        this.autocompleteItems = data.map((item) => ({
          text: `${item.City}, ${item.State}, ${item.PostalCode}`,
          value: item,
        }));
      } catch (error) {
        console.error("Error fetching autocomplete data", error);
      } finally {
        this.loading = false;
      }
    },
  
  },
};
</script>
