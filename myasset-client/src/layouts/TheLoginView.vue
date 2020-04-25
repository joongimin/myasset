<template>
  <div class="TheLoginView">
    <div class="TheLoginView__inner">
      <div class="TheLoginView__title">{{ title }}</div>
      <div class="TheLoginView__sub-title">{{ subTitle }}</div>
      <div v-if="message || subMessage" class="TheLoginView__messages">
        <div v-if="message" class="TheLoginView__message">
          <pre>{{ message }}</pre>
        </div>
        <div v-if="subMessage" class="TheLoginView__sub-message">
          <pre>{{ subMessage }}</pre>
        </div>
      </div>
      <div class="TheLoginView__content">
        <slot />
        <AppLoadingScreen :is-loading="isLoading" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheLoginView',
  props: {
    title: {
      type: String,
      default() {
        return this.$t('title');
      }
    },
    subTitle: {
      type: String,
      default() {
        return this.$t('sub_title');
      }
    },
    message: { type: String, default: null },
    subMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false }
  },
  mounted() {
    document.title = this.title;
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins/_texts.scss';

.TheLoginView {
  width: 320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.TheLoginView__inner {
  flex-grow: 1;
  position: relative;
  top: -40px;
}

.TheLoginView__title {
  @include text-title;
  font-size: 36px;
}

.TheLoginView__sub-title {
  @include text-sub-navigation;
  margin-top: 25px;
  margin-bottom: 40px;
  letter-spacing: -0.5px;
}

.TheLoginView__messages {
  margin-bottom: 32px;
}

.TheLoginView__message {
  @include text-label;
}

.TheLoginView__sub-message {
  margin-top: 12px;
  @include text-content;
}

.TheLoginView__content {
  position: relative;
}
</style>

<i18n locale="en">
{
  "title": "MyAsset",
  "sub_title": "Login"
}
</i18n>
