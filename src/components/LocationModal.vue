<template>
  <v-dialog v-model="isShown">
    <GmapMap
      :center="center"
      :zoom="zoom"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true
      }"
    >
      <GmapMarker v-if="position" :position="position" :draggable="true" @drag="updateCoordinates" />
    </GmapMap>

    <v-btn @click="submit">Submit</v-btn>
    <v-btn @click="cancel">Cancel</v-btn>
  </v-dialog>
</template>

<script>
import { EventBus } from 'components-system';

export default {
  name: 'LocationModal',
  data() {
    return {
      isShown: false,
      center: { lat: 0, lng: 0 },
      zoom: 1,
      position: null,
    }
  },
  created() {
    EventBus.$off('location-modal');
    EventBus.$on('location-modal', (pos) => {
      if (pos) {
        this.zoom = 8;
        this.center = pos;
        this.position = pos;
      }

      this.isShown = true;
    });
  },
  methods: {
    updateCoordinates(location) {
      this.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    submit() {
      EventBus.$emit('location-modal:submit', this.position);
      this.isShown = false;
    },
    cancel() {
      this.isShown = false;
    }
  }
};
</script>

<style></style>
