

<template>
    <div>
      
      <p>{{ this.$store.state.tresults.TripDistance }}</p>
     
   
    
    </div>
  </template>
  
  <script>
  
  
  export default {
    
    props: ['tresults'],
  
    
    mounted() {
      // Listen for the custom event emitted by the first component
      this.$root.$on('trip-results', this.handleTripResults);
    },
  
    computed: {
      
    },
    watch: {
      tresults(newResults) {
        // This watcher will be triggered whenever tresults changes in the parent
        console.log('tresults changed in parent:', newResults);
  
        // You can update the child component's data or perform any other actions here
      }},
    handleTripResults(tresults) {
        // Now you can use the tresults data in this component
        console.log('Received trip results:', tresults);
        // Update your component's data or perform any other actions
      },
      beforeDestroy() {
      // Don't forget to remove the event listener to avoid memory leaks
      this.$root.$off('trip-results', this.handleTripResults);
    },
  };
  </script>