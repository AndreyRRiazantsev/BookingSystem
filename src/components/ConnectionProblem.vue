<template>
  <v-snackbar :value="true" timeout="-1" absolute bottom>
    Connection problem
  </v-snackbar>
</template>

<script>
export default {
  name: 'ConnectionProblem',
};
</script>
