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
            <v-icon class="red py-5"> mdi-access-point </v-icon>
          </v-col>
        </v-row>
      </v-container>

      <section class="dropdown-wrapper">
        <div @click="isVisible = !isVisible" class="selected-item">
          <span v-if="selectedItem">{{
            selectedItem.City +
            "," +
            selectedItem.State +
            ", " +
            selectedItem.PostalCode
          }}</span>
          <span v-else>{{this.myPos}}</span>
          <svg
            :class="isVisible ? 'dropdown' : ''"
            class="drop-down-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 8l6 6H6z" />
          </svg>
        </div>

        <div
          :class="isVisible ? 'visible' : 'invisible'"
          class="dropdown-popover"
        >
          <!-- First Input Field -->
          <v-text-field
            label="Origin"
            :rules="rules"
            hide-details="auto"
            class="px-2"
            v-model="myPos"
            type="text"
            placeholder="Search for Location"
            tabindex="1"
          ></v-text-field>

          <!-- Second Input Field -->

          <span v-if="results.length == 0">No Data Available</span>
          <div class="options">
            <ul>
              <li
                @click="selectItem(Location)"
                v-for="(Location, index) in results"
                :key="`City-${index}`"
              >
                {{
                  Location.City +
                  ", " +
                  Location.State +
                  ", " +
                  Location.PostalCode
                }}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <div class="py-1"></div>
      <section class="dropdown-wrapper2">
        <div @click="isVisible2 = !isVisible2" class="selected-item2">
          <span v-if="selectedItem2">{{
            selectedItem2.City +
            "," +
            selectedItem2.State +
            ", " +
            selectedItem2.PostalCode
          }}</span>
          <span v-else>Destination Location</span>
          <svg
            :class="isVisible2 ? 'dropdown2' : ''"
            class="drop-down-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 8l6 6H6z" />
          </svg>
        </div>

        <div
          :class="isVisible2 ? 'visible2' : 'invisible2'"
          class="dropdown-popover2"
        >
          <!-- First Input Field -->

          <!-- Second Input Field -->
          <v-text-field
            label="Destination"
            :rules="rules"
            hide-details="auto"
            class="px-2"
            v-model="destinationPos"
            type="text"
            placeholder="Search for Destination"
          ></v-text-field>

          <br />

          <span v-if="results2.length == 0">No Data Available</span>
          <div class="options2">
            <ul>
              <li
                @click="selectItem2(Location2)"
                v-for="(Location2, index) in results2"
                :key="`City-${index}`"
              >
                {{
                  Location2.City +
                  ", " +
                  Location2.State +
                  ", " +
                  Location2.PostalCode
                }}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <br />
      <br />
      <div class="px-2 my-15">
        <v-card-text>Trip Options</v-card-text>
        <v-select :items="r_items" filled label="Practical"></v-select>
        <v-switch pa-5 v-model="checkbox2" :label="`Close Borders`"></v-switch>
        <v-switch
          class="p-0 m-0"
          v-model="checkbox3"
          :label="`Avoid Toll`"
        ></v-switch>
        <v-btn @click="testRunTrip"> Run Trip </v-btn>
        {{ this.tresults.TripDistance }}

        <div></div>
      </div>
    </v-card>
  </div>
</template>

<script>
//import autoComplete from "./autoComplete.vue"

import { lookUpKey, tmAPIKey } from "./tmAPIKey";

import { mapMutations, mapActions } from "vuex";
import TripResults from "./TripResults.vue";

export default {
  components: { TripResults },
  name: "TripDetail",
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
    results2: [],
    selectedItem: null,
    selectedItem2: null,
    isVisible: false,
    isVisible2: false,

    searchQuery: "",
    Location: [],
    Location2: [],
    timeout: null,
    debounceMilliseconds: 250,
    tresults: [],
  }),
  watch: {
    checkbox1: function (newValue) {
      if (newValue) {
        this.setOriginToCurrentLocation();
      } else {
        this.myPos = "";
        this.getLocations();
      }
    },
    myPos: function () {
      if (this.myPos.length >= 3 && !this.checkbox1) {
        this.getLocations();
      }
    },
    destinationPos: function () {
      if (this.destinationPos.length >= 3)
        // Add any logic related to the destinationPos here
        // You can call getLocations or perform any other necessary actions
        this.getLocations2();
    },
  },
  methods: {
    
    setOriginToCurrentLocation() {
      if (navigator.geolocation) {
        var options = {
          maximumAge: 0,
          timeout: 30000,
          enableHighAccuracy: true,
        };
        navigator.geolocation.getCurrentPosition(
          this.success.bind(this),
          this.error.bind(this),
          [options]
        );
      } else {
        alert("User did not allow access to GPS location");
      }
    },

    success(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      this.myPos = lat + ":" + lon;
    },

    error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },

    async getLocations() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        fetch(this.url + this.myPos + this.apikey)
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            this.results = json;
          });
      }, this.debounceMilliseconds);
    },
    async getLocations2() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        fetch(this.url + this.destinationPos + this.apikey)
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            this.results2 = json;
          });
      }, this.debounceMilliseconds);
    },

    selectItem(Location) {
      this.selectedItem = Location;
    
      this.isVisible = false;
    },
    selectItem2(Location2) {
      this.selectedItem2 = Location2;

      this.isVisible2 = false;
    },
    filteredLoctions() {
      return this.userArray.filter((Location) => {
        return Object.values(Location);
      });
    },
    filteredLoctions2() {
      return this.userArray.filter((Location2) => {
        return Object.values(Location2);
      });
    },
    testRunTrip() {
      const trip = {
        TripLegs: [
          {
            Address: "",
            City: this.selectedItem.City,
            State: this.selectedItem.State,
            PostalCode: this.selectedItem.PostalCode,
            Latitude: "",
            Longitude: "",
            LocationText: "",
          },
          {
            Address: "",
            City: "",
            State: "",
            PostalCode: "",
            Latitude: "",
            Longitude: "",
            LocationText: this.destinationPos,
          },
        ],
        UnitMPG: 6,
        RoutingMethod: 0,
        BorderOpen: true,
        AvoidTollRoads: false,
        VehicleType: 7,
        AllowRelaxRestrictions: false,
        GetDrivingDirections: false,
        GetMapPoints: false,
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
          console.log(this.myPos);
          console.log(JSON.stringify(data));
          this.tresults = data;
          this.$store.commit("setTResults", data);
          this.$emit("trip-results", this.tresults);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>
<style scoped lang="scss">
#auto-complete {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #be1f1f;
  margin-top: 0px;
}
.form-control {
  background: #2c1515;
}

.dropdown-wrapper {
  max-width: 100%;
  position: relative;
  margin: 5 auto;
  z-index: 3;
  background: #c8c4c4;
  .selected-item {
    height: 40px;
    border-bottom: 2px solid rgb(228, 61, 61);
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 400;

    .drop-down-icon {
      transform: rotate(0deg);
      transition: all 0.4s ease;
      &.dropdown {
        transform: rotate(180deg);
      }
    }
  }
  .dropdown-popover {
    z-index: 1;
    border: 2px solid rgb(157, 4, 4);
    top: 46px;
    left: 0;
    right: 0;
    color: red;
    max-width: 100%;
    padding: 1px;
    visibility: hidden;
    transition: all 0.5s ease-in-out;
    max-height: 0px;
    overflow: hidden;

    &.visible {
      max-height: 400px;
      visibility: visible;
    }
  }
  input {
    width: 90%;
    height: 30px;
    border: 2px solid lightgray;
    font-size: 16px;
    padding-left: 8px;
    margin-bottom: 5px;
  }

  .options {
    width: 100%;
    position: absolute;

    ul {
      list-style: none;
      text-align: left;
      padding-left: 8px;
      max-height: 200px;
      overflow-y: scroll;
      border: 1px solid rgb(63, 15, 15);

      li {
        width: 100%;
        border-bottom: 1px solid lightgray;
        padding: 10px;
        background-color: #d81a1a;
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        &:hover {
          background: #70878a;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}

#auto-complete2 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #be1f1f;
  margin-top: 0px;
}
.form-control2 {
  background: #2c1515;
}

.dropdown-wrapper2 {
  max-width: 100%;
  position: relative;
  margin: 5 auto;
  z-index: 1;
  background: #c8c4c4;
  .selected-item2 {
    height: 40px;
    border-bottom: 2px solid rgb(228, 61, 61);
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 400;

    .drop-down-icon2 {
      transform: rotate(0deg);
      transition: all 0.4s ease;
      &.dropdown2 {
        transform: rotate(180deg);
      }
    }
  }
  .dropdown-popover2 {
    border: 2px solid rgb(157, 4, 4);
    top: 46px;
    left: 0;
    right: 0;
    color: red;
    max-width: 100%;
    padding: 1px;
    visibility: hidden;
    transition: all 0.5s ease-in-out;
    max-height: 0px;
    overflow: hidden;
    &.visible2 {
      max-height: 400px;
      visibility: visible;
    }
  }
  input2 {
    width: 90%;
    height: 30px;
    border: 2px solid lightgray;
    font-size: 16px;
    padding-left: 8px;
    margin-bottom: 5px;
  }

  .options2 {
    width: 100%;

    ul {
      list-style: none;
      text-align: left;
      padding-left: 8px;
      max-height: 200px;
      overflow-y: scroll;
      border: 1px solid rgb(63, 15, 15);

      li {
        width: 100%;
        border-bottom: 1px solid lightgray;
        padding: 10px;
        background-color: #d81a1a;
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        &:hover {
          background: #70878a;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
