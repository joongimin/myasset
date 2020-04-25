<template>
  <Component :is="group.i18n ? 'i18n' : 'div'" :path="group.i18n">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="group.type === 'static'" v-html="group.value" />
    <ul v-else-if="group.type === 'list'" class="app-list">
      <li v-for="(v, i) in group.value" :key="i" class="app-list__item">
        {{ v }}
      </li>
    </ul>
    <AppButton
      v-else-if="group.type === 'button'"
      :label="group.value"
      :disabled="group.disabled"
      @click="group.clickHandler"
    />
    <AppTextInput
      v-else-if="['text', 'url', 'email', 'tel'].includes(group.type)"
      :id="group.inputId"
      :name="group.inputName"
      :value="group.value"
      :maxlength="group.maxlength"
      :placeholder="group.placeholder"
      :type="group.type"
      :input-size="inputSize"
      :autocomplete="group.autocomplete"
      :invalid="invalid"
      @blur="blur"
      @change="change"
    />
    <AppPasswordInput
      v-else-if="group.type === 'password'"
      :id="group.inputId"
      :name="group.inputName"
      :value="group.value"
      :placeholder="group.placeholder"
      :type="group.type"
      :input-size="inputSize"
      :autocomplete="group.autocomplete"
      :invalid="invalid"
      @blur="blur"
      @change="change"
    />
  </Component>
</template>

<script>
export default {
  name: 'AppFormField',
  props: {
    group: { type: Object, required: true },
    invalid: { type: Boolean, required: true },
    inputSize: { type: String, default: null },
    errors: { type: Object, required: true }
  },
  methods: {
    blur() {
      this.$emit('blur');
    },
    change(e) {
      this.$emit('change', e);
    }
  }
};
</script>
