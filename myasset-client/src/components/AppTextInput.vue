<template>
  <input
    :value="currentValue"
    :type="type"
    v-bind="{ id, name, value, placeholder, maxlength, disabled }"
    :class="[
      'AppTextInput',
      inputSize ? `AppTextInput--${inputSize}` : null,
      { 'AppTextInput--invalid': invalid }
    ]"
    @input="change($event.target.value)"
    @blur="noTrim ? blur() : trimAndBlur()"
  />
</template>

<script>
import TextInput from '@/mixins/TextInput';

export default {
  name: 'AppTextInput',
  mixins: [TextInput],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    inputSize: { type: String, default: null },
    noTrim: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins/_inputs.scss';

.AppTextInput {
  @include input-base;
  @include input-placeholder;
  padding: 5px 11px;

  &--large {
    padding-top: 9px;
    padding-bottom: 9px;
  }
}
</style>
