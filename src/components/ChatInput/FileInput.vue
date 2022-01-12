<template>
  <div>
    <input ref="input" type="file" class="file-input" @change="onInput" accept="image/*;capture=camera:video/*;application/pdf" />

    <slot :click="onClick">
      <button type="button" @click="onClick">
        Upload
      </button>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  methods: {
    onClick() {
      this.$refs.input.click();
    },
    onInput(e) {
      const { files } = e.target;

      const file = files[0];

      this.$store.dispatch('chatFlow/sendFile', file);
    }
  }
};
</script>

<style lang="scss" scoped>
.file-input {
  display: none;
}
</style>
