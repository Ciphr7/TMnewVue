<template>
  <section>
    <v-autocomplete
  v-model="localselectedItem2"
  :base-color="baseColor"
  :color="color"
  :no-data-text="noDataText"
  :items="autocompleteItems"
  :loading="loading"
  v-model:search-input="searchInput2"
  :min-length="minLength"
  @update:search-input="onAutocompleteChange2"
  @input="onAutocompleteChange2"
  :item-text="itemText2"
  :item-value="itemText2 ? String(itemText2) : null"
  :label="label"
></v-autocomplete>
  </section>
</template>

<script>
import { ref, watch, onBeforeUnmount  } from 'vue'; // Import ref and watch from Vue 3

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
      type: String,  // Make sure to define itemText2 in the props
      default: "text",
    },
    label: {
      type: String,  // Make sure to define label in the props
      default: "Destination",
    },
  },
  setup(props) {
    const autocompleteItems = ref([]);
    const loading = ref(false);
    const searchInput2 = ref("");
    const dest = ref("");
    const localselectedItem2 = ref(null);

    watch(searchInput2, (newSearchInput) => {
      if (newSearchInput && newSearchInput.length >= props.minLength) {
        onAutocompleteChange2();
      }
    });

    watch(localselectedItem2, (newValue2) => {
      props.onUpdateSelectedItem2(newValue2);
    });
    const isComponentMounted = ref(true);

onBeforeUnmount(() => {
  isComponentMounted.value = false;
});

    const onAutocompleteChange2 = async function () {
      if (localselectedItem2.value) {
        dest.value = localselectedItem2.value;
      } else {
        dest.value = "";
      }

      loading.value = true;

      try {
        const response = await fetch(
          `https://prime.promiles.com/WebAPI/api/ValidateLocation?locationText=${dest.value}&apikey=bU03MSs2UjZIS21HMG5QSlIxUTB4QT090`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (isComponentMounted.value) {
      autocompleteItems.value = data.map((item) => ({
        text: `${item.City}, ${item.State}, ${item.PostalCode}`,
        value: item,
      }));
    }
  } catch (error) {
    console.error("Error fetching autocomplete data", error);
  } finally {
        loading.value = false;
      }
    };

    return {
      autocompleteItems,
      loading,
      searchInput2,
      dest,
      localselectedItem2,
      onAutocompleteChange2,
    };
  },
};
</script>
