<template>
  <FileInput v-slot="{ click }">
    <button @click="click" class="field-btn">
      <i class="fas fa-paperclip" :style="{ color: btnBgColor }"></i>
    </button>
  </FileInput>
</template>

<script>
import FileInput from './FileInput';

export default {
  name: 'FileUpload',
  components: {
    FileInput,
  },
  computed: {
    btnBgColor() {
      return this.$store.getters['theme/btnBgColor'];
    },
  }
};
</script>
