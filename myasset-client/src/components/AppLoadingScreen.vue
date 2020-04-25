<template>
  <Transition name="fade" @leave="$emit('leave')">
    <div v-if="isLoading" class="AppLoadingScreen" />
  </Transition>
</template>

<script>
export default {
  name: 'AppLoadingScreen',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/vars/_z-indexes.scss';

.AppLoadingScreen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: $z-index-screen;
}
</style>
