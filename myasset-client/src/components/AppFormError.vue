<template>
  <div v-if="error && error.errorMessage" class="AppFormError">
    {{ error.errorMessage }}
  </div>
</template>

<script>
export default {
  name: 'AppFormError',
  props: {
    error: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins/_texts.scss';

.AppFormError {
  @include text-caption-red;
  margin-top: 4px;
  text-align: left;
}
</style>
