<template>
  <svg
    class="AppSvgIcon"
    :style="{ width: `${currentWidth}px`, height: `${currentHeight}px` }"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script>
export default {
  name: 'AppSvgIcon',
  props: {
    name: { type: String, required: true },
    height: { type: Number, default: 0 }
  },
  data() {
    return {
      iconPath: '',
      srcWidth: 0,
      srcHeight: 0,
      currentWidth: 0,
      currentHeight: 0
    };
  },
  watch: {
    name() {
      this.updateIcon();
    },
    height() {
      this.updateDimension();
    }
  },
  mounted() {
    this.updateIcon();
  },
  methods: {
    updateIcon() {
      const svg = require(`../assets/icons/${this.name}.svg`);
      const { url, viewBox } = svg.default;
      this.iconPath = url;

      const coords = viewBox.split(' ');
      this.srcWidth = Number.parseInt(coords[2]);
      this.srcHeight = Number.parseInt(coords[3]);

      this.updateDimension();
    },
    updateDimension() {
      this.currentHeight = this.height || this.srcHeight;
      this.currentWidth = this.currentHeight * (this.srcWidth / this.srcHeight);
    }
  }
};
</script>

<style scoped>
.AppSvgIcon {
  fill: currentColor;
  stroke: currentColor;
}
</style>
