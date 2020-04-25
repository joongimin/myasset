<template>
  <AppButton
    :button-style="errorSummary ? 'red' : 'blue'"
    :disabled="disabled || isSubmitting || !!errorSummary"
    :label="isSubmitting ? submittingLabel : submitLabel"
    :tooltip="errorSummary"
    v-bind="{ type, size }"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'AppButtonSubmit',
  props: {
    type: {
      type: String,
      default: 'submit'
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    submitLabel: {
      type: String,
      default() {
        return this.$t('app.save');
      }
    },
    submittingLabel: {
      type: String,
      default() {
        return this.$t('app.saving');
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorSummary: {
      type: String,
      default: null
    },
    size: { type: String, default: null }
  }
};
</script>
