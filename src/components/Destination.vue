<template>
  <section>
    <v-autocomplete
      v-model="localselectedItem2"
      :base-color="baseColor"
      :color="color"
      :no-data-text="noDataText"
      :items="autocompleteItems"
      :loading="loading"
      :search-input.sync="searchInput2"
      :min-length="minLength"
      @input="onAutocompleteChange2"
      :item-text="itemText2"
      :item-value="itemText2 ? String(itemText2) : null"
      :label="label"
    ></v-autocomplete>
  </section>
</template>

<script>
export default {
  props: {
    selectedItem2: {
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
      default: "i.e. Houston, tx",
    },
    minLength: {
      type: Number,
      default: 3,
    },
    itemText2: {
      type: String,
      default: "text",
    },
    itemValue2: {
    type: String,
    default: null,
  },
    label: {
      type: String,
      default: "Destination",
    },
  },
  data() {
    return {
      autocompleteItems: [],
      loading: false,
      searchInput2:  "",
      dest: "", // Add this line if origin is used in the template
      localselectedItem2: null,
    };
  },
  watch: {
    selectedItem2(newValue2) {
      // Update localselectedItem2 when the prop changes
      this.localselectedItem2 = newValue2;
    },
    searchInput2(newSearchInput) {
    if (newSearchInput && newSearchInput.length >= this.minLength) {
      this.onAutocompleteChange2();
    }
  },
    localselectedItem2(newValue2) {
      // Emit an event to notify the parent when localSelectedItem changes
      this.$emit("update:selectedItem2", newValue2);
    },
  },
  methods: {
    onAutocompleteChange2: async function (item) {
      // 'item' contains the selected item
      if (item) {
        this.dest = item.text;
      } else {
        this.dest = ""; // Handle the case when no item is selected
      }

      // The rest of your code remains the same
      this.loading = true;

      try {
        const response = await fetch(
          `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${this.searchInput2}&apikey=bU03MSs2UjZIS21HMG5QSlIxUTB4QT090`
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
