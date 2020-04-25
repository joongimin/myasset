<template>
  <div class="AppPasswordInput">
    <AppTextInput
      :type="isPasswordVisible ? 'text' : 'password'"
      class="AppPasswordInput__input"
      no-trim
      v-bind="{
        id,
        name,
        value,
        placeholder,
        invalid,
        inputSize,
        autocomplete
      }"
      v-on="$listeners"
    />
    <button
      class="AppPasswordInput__show-hide-button"
      type="button"
      tabindex="-1"
      @click="isPasswordVisible = !isPasswordVisible"
    >
      <AppSvgIcon
        class="AppPasswordInput__show-hide-icon"
        :name="isPasswordVisible ? 'icon-password-show' : 'icon-password-hide'"
      />
    </button>
  </div>
</template>

<script>
import AppTextInput from './AppTextInput';

export default {
  name: 'AppPasswordInput',
  components: { AppTextInput },
  model: { event: 'change' },
  props: {
    id: { type: String, default: null },
    name: { type: String, default: null },
    value: { type: String, default: null },
    placeholder: { type: String, default: null },
    invalid: { type: Boolean, default: false },
    inputSize: { type: String, default: null },
    autocomplete: { type: String, default: null }
  },
  data() {
    return { isPasswordVisible: false };
  }
};
</script>

<style lang="scss" scoped>
.AppPasswordInput {
  position: relative;
}

$icon-size: 17px;
$icon-padding: 10px;

.AppPasswordInput__input {
  padding-right: $icon-size + $icon-padding * 2;
}

.AppPasswordInput__show-hide-button {
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  padding: 0 $icon-padding;
}

.AppPasswordInput__show-hide-icon {
  position: relative;
  top: 1px;
}
</style>
