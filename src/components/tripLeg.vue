<template>
    <!-- Your HTML template goes here -->
  </template>
  
  <script>
  export default {
    methods: {
      runFullTrip() {
        let origin = null;
        const originText = this.$refs.origin.value;
  
        if (originText.includes(':')) {
          const [lat, lon] = originText.split(':');
          origin = new PRIMEWebAPI.TripLeg({ latitude: Number(lat), longitude: Number(lon) });
        } else {
          origin = new PRIMEWebAPI.TripLeg({ locationText: originText });
        }
  
        const stop1 = new PRIMEWebAPI.TripLeg({ locationText: this.$refs.stop1.value });
  
        const tripLegs = [origin];
  
        if (originText !== '') {
          tripLegs.push(stop1);
        }
  
        const selectedOption = this.$refs.rtMethod.options[this.$refs.rtMethod.selectedIndex];
        this.$refs.myRtMethod.innerHTML = 'RtMethod = ' + selectedOption.value;
  
        const fo = new PRIMEWebAPI.FuelOptimizationOptions({
          unitMPG: this.$refs.setMPG.value,
          unitTankCapacity: this.$refs.setTankCapacity.value,
          startGallons: this.$refs.setStartGallon.value,
          desiredEndGallons: this.$refs.setDesiredEndGallon.value,
          distanceOOR: this.$refs.setDistanceOOR.value,
          minimumGallonsToPurchase: this.$refs.setMinGallons.value,
          minimumTankGallonsDesired: this.$refs.setMinTankGallons.value
        });
  
        const closeBorder = this.$refs.CloseBorder.checked;
        const isHazmat = this.$refs.IsHazmat.checked;
        const avoidToll = this.$refs.AvoidToll.checked;
  
        const trip = new PRIMEWebAPI.Trip({
          tripLegs: tripLegs,
          routingMethod: PRIMEWebAPI.RoutingMethods.PRACTICAL,
          borderOpen: !closeBorder,
          avoidTollRoads: avoidToll,
          vehicleType: PRIMEWebAPI.VehicleTypes.TRACTOR3AXLETRAILER2AXLE,
          getDrivingDirections: true,
          getMapPoints: true,
          getStateMileage: true,
          getTripSummary: true,
          getFuelOptimization: true,
          getTruckStopsOnRoute: true,
          fuelOptimizationParameters: fo,
          isHazmat: isHazmat,
          unitMPG: 5
        });
  
        const rtMet = this.$refs.rtMethod.value;
  
        if (rtMet === 'SHORTEST') {
          trip.routingMethod = PRIMEWebAPI.RoutingMethods.SHORTEST;
        } else if (rtMet === 'INTERSTATE') {
          trip.routingMethod = PRIMEWebAPI.RoutingMethods.INTERSTATE;
        }
  
        PRIMEWebAPI.runTrip(trip, this.handleTrip);
      },
      handleTrip(response) {
        // Handle the trip response as needed
      }
    }
  };
  </script>
  