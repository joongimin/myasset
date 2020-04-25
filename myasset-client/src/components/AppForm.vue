<template>
  <form
    :class="[
      'AppForm',
      formStyle ? `AppForm--${formStyle}` : null,
      sectionStyle ? `AppForm--section-style-${sectionStyle}` : null
    ]"
    @submit.prevent="submit"
  >
    <slot />
    <slot name="head" />
    <div class="AppForm__sections">
      <fieldset
        v-for="section in currentSections"
        :id="section.sectionElementId"
        :key="section.id"
        :class="{
          AppForm__section: !!section.id,
          'super-admin__item': section.superAdmin
        }"
      >
        <legend v-if="section.label" class="AppForm__section-title">
          {{ section.label }}
        </legend>
        <div
          v-for="(group, index) in section.groups"
          :id="group.groupElementId"
          :key="`${group.id}-${index}`"
          :class="['AppForm__group', { 'super-admin__item': group.superAdmin }]"
        >
          <div v-if="group.label" class="AppForm__group-title">
            <AppCheckbox
              v-if="group.type === 'checkbox'"
              :id="group.inputId"
              :name="group.inputName"
              :checked="group.value"
              :label="group.label"
              :invalid="!!getFieldError(group.id)"
              class="AppForm__group-title-checkbox"
              @change="changeGroup(group, $event)"
            />
            <label v-else :for="group.inputId">
              {{ group.label }}
            </label>
            <span v-if="isRequired(group)" class="AppForm__group-title-required"
              >*</span
            >
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="group.groupDescription"
            class="AppForm__group-description"
            v-html="group.groupDescription"
          />
          <!-- eslint-enable vue/no-v-html -->
          <slot
            name="group"
            v-bind="{
              ...group,
              error: getFieldError(group.id),
              errors: validationErrors
            }"
          >
            <div
              v-if="group.type !== 'checkbox'"
              :class="[
                'AppForm__group-field',
                group.fieldStyle
                  ? `AppForm__group-field--${group.fieldStyle}`
                  : null
              ]"
            >
              <AppFormField
                v-focus="focusGroupId === group.id"
                :group="group"
                :invalid="!!getFieldError(group.id)"
                :input-size="inputSize"
                :errors="validationErrors"
                @blur="blurGroup(group.id)"
                @change="changeGroup(group, $event)"
                @validate="validateOrUnset"
              >
                <template v-if="$scopedSlots['group-label']" #label="props">
                  <slot name="group-label" v-bind="props" />
                </template>
                <template
                  v-if="$scopedSlots['group-sub-item']"
                  #sub-item="props"
                >
                  <slot name="group-sub-item" v-bind="props" />
                </template>
              </AppFormField>
            </div>
          </slot>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="group.description"
            class="AppForm__description"
            v-html="group.description"
          />
          <AppFormError :error="getFieldError(group.id)" />
        </div>
      </fieldset>
    </div>
    <AppAdvancedSettingsButton
      v-if="advancedSection"
      v-model="isAdvancedSettingsVisible"
      v-tooltip="isAdvancedSettingsVisible ? '' : advancedSection.tooltip"
      class="AppForm__advanced-settings-button"
    />
    <div v-if="submitButton" class="AppForm__form-controls">
      <AppButtonSubmit
        v-bind="typeof submitButton === 'object' ? submitButton : {}"
        :is-submitting="isSubmitting"
        :error-summary="validateOnlyOnSubmit ? null : errorSummary"
        :size="inputSize"
      />
    </div>
    <!-- Implicit Submission -->
    <!-- https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission -->
    <input v-else v-show="false" type="submit" />
    <AppLoadingScreen v-if="!noScreen" :is-loading="isSubmitting" />
  </form>
</template>

<script>
import _ from 'lodash';
import FormValidator from '@/mixins/FormValidator';

export default {
  name: 'AppForm',
  mixins: [FormValidator],
  model: {
    prop: 'object',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: null
    },
    sections: {
      type: Array,
      required: true
    },
    objectId: {
      type: String,
      default: null
    },
    object: {
      type: Object,
      default: null
    },
    formStyle: {
      type: String,
      default: null
    },
    submitButton: {
      type: [Boolean, Object],
      default: false
    },
    eventBus: {
      type: Object,
      default: null
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    focusGroupId: {
      type: String,
      default: null
    },
    groupLabelNamespace: {
      type: String,
      default() {
        return `settings.${this.id}.groups`;
      }
    },
    noScreen: { type: Boolean, default: false },
    validateOnlyOnSubmit: { type: Boolean, default: false },
    sectionStyle: { type: String, default: '' }
  },
  data() {
    return { isAdvancedSettingsVisible: false };
  },
  computed: {
    advancedSection() {
      return this.sections.find(({ id }) => id === 'advanced');
    },
    visibleSections() {
      return this.advancedSection && !this.isAdvancedSettingsVisible
        ? this.sections.filter(s => s !== this.advancedSection)
        : this.sections;
    },
    currentSections() {
      return this.visibleSections.map(section => ({
        ...section,
        label: this.sectionLabel(section),
        groups: section.groups.map(group => {
          let inputName =
            'name' in group ? group.name : this.inputName(group.id);
          if (
            !group.packingMethod &&
            (group.type === 'tags' ||
              group.type === 'multiple_select' ||
              group.type === 'multiple_select_box' ||
              group.type === 'multiple_select_checkbox' ||
              group.multiple)
          )
            inputName = `${inputName}[]`;

          if (group.type == 'multiple_select_box') group.fieldStyle = 'mt12';

          const result = {
            ...group,
            inputId: `${this.id}_${group.id}`,
            invalid: !!group.invalid,
            inputName
          };

          if (group.type === 'hash_select_checkbox')
            result.options = group.options.map(option => ({
              ...option,
              name: this.inputName(option.id)
            }));

          if (!('value' in result)) {
            if (group.type === 'new_password_requirements')
              result.value = this.object.password
                ? this.object.password.password
                : '';
            else if (group.type === 'hash_select_checkbox') {
              const optionIds = group.options.map(o => o.id);
              result.value = _.pick(this.object, optionIds);
            } else if (group.type === 'hash_select_button') {
              const ids = group.selectButtons.map(o => o.id);
              result.value = _.pick(this.object, ids);
            } else result.value = this.objectValue(group.id);
          }

          if (result.label === undefined) {
            result.label = this.$t(`${this.groupLabelNamespace}.${group.id}`);
          }

          result.groupElementId = `${section.id ? `${section.id}--` : ''}${
            group.id
          }`;

          if (group.invalid) {
            this.setFieldError(group.id, {
              errorMessage: group.invalid === true ? '' : group.invalid
            });
          }

          if (result.i18n && !('input' in result)) result.inline = true;

          result.eventHandlers = result.eventHandlers || {};
          return result;
        })
      }));
    },
    inputSize() {
      return this.formStyle === 'wide' ? 'large' : null;
    }
  },
  mounted() {
    this.$emit('mounted');
    if (this.eventBus) {
      this.eventBus.$on('submit', () => this.submit());
      this.eventBus.$on('validate-field', this.validateField);
      this.eventBus.$on('unset-field-error', id => {
        this.unsetFieldError(id);
      });
      this.eventBus.$on('set-field-error', (id, error) => {
        this.setFieldError(id, error);
      });
    }
  },
  methods: {
    submit() {
      let firstInvalidGroup = null;
      this.clearErrors();
      this.currentSections.forEach(section => {
        section.groups.forEach(group => {
          this.doValidateField(group.id);
          if (!!this.getFieldError(group.id) && !firstInvalidGroup)
            firstInvalidGroup = group;

          if (group.fields) {
            group.fields.forEach(field => {
              this.doValidateField(field.id);
              if (!!this.getFieldError(field.id) && !firstInvalidGroup)
                firstInvalidGroup = group;
            });
          }
        });
      });

      if (!this.hasError) {
        const formData = new FormData(this.$el);
        this.$emit('submit', formData);
      }
    },
    findGroupById(id) {
      let group = null;
      this.currentSections.some(section => {
        group = section.groups.find(g => g.id === id);
        return !!group;
      });
      return group;
    },
    isRequired(group) {
      if ('required' in group) return group.required;

      return (
        group.validate &&
        group.validate.some(arg => this.validateRule(arg) === 'required')
      );
    },
    validateRule(arg) {
      return typeof arg === 'string' ? arg : arg.rule;
    },
    sectionLabel(section) {
      if (section.label) return section.label;
      if (section.id) {
        const labelKey = `settings.${this.id}.sections.${section.id}`;
        if (this.$te(labelKey)) return this.$t(labelKey);
      }
    },
    inputName(id) {
      return `${this.objectId}[${id}]`;
    },
    objectValue(id) {
      return this.object ? this.object[id] : null;
    },
    changeGroup(group, value) {
      const newObject = { ...this.object };
      switch (group.type) {
        case 'image':
          newObject[group.id] = value.imageUrl;
          newObject[`remove_${group.id}`] = value.removeImage || undefined;
          break;
        case 'hash_select_checkbox':
        case 'hash_select_button':
          Object.assign(newObject, value);
          break;
        default:
          newObject[group.id] = value;
          break;
      }

      this.$emit('change', _.omitBy(newObject, _.isUndefined));
      this.$emit('change-group', { ...group, value });
      this.validateOrUnset(group.id);
    },
    blurGroup(id) {
      this.validateOrUnset(id);
    },
    validateOrUnset(id) {
      if (this.validateOnlyOnSubmit) this.unsetFieldError(id);
      else this.validateField(id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/vars/_colors.scss';
@import '@/scss/mixins/_texts.scss';
@import '@/scss/mixins/_inputs.scss';
@import '@/scss/mixins/_clearfix.scss';
@import '@/scss/mixins/_breakpoints.scss';

.AppForm {
  @include text-content;
  @include clearfix;
  position: relative;
  text-align: left;
}

.AppForm__section {
  position: relative;
  padding: 32px 0;

  @include media-breakpoint-each(desktop) {
    .AppForm--hor & {
      padding-left: 200px;
    }
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  & + & {
    border-top: 1px solid $color-layout-section;
    padding-top: 33px;
  }

  .AppForm--section-style-narrow & + & {
    border-top: 0;
    padding-top: 0;
  }
}

.AppForm__section-title {
  display: block;
  @include text-sub-title;
  padding-bottom: 24px;

  .AppForm--section-style-narrow & {
    padding-bottom: 12px;
  }

  @include media-breakpoint-each(desktop) {
    .AppForm--hor & {
      @include text-label;
      position: absolute;
      width: 200px;
      left: 0;
    }
  }
}

legend.AppForm__section-title {
  float: left;
  + * {
    clear: both;
  }
}

.AppForm__group {
  @include text-content;

  & + & {
    margin-top: 32px;

    .AppForm--narrow & {
      margin-top: 20px;
    }

    .AppForm--wide & {
      margin-top: 16px;
    }
  }
}

.AppForm__group-title {
  @include text-label;
}

.AppForm__group-title-checkbox {
  margin-right: 4px;
  transform: translateY(-1px);
}

.AppForm__group-title-required {
  color: $color-red;
}

.AppForm__group-description {
  margin-top: 4px;
}

.AppForm__advanced-settings-button {
  margin-top: 32px;
}

.AppForm__form-controls {
  padding-top: 32px;

  .AppForm--narrow & {
    padding-top: 24px;
  }

  .AppForm--wide & {
    padding-top: 24px;
  }
}
</style>

<style lang="scss">
@import '@/scss/mixins/_texts.scss';

.AppForm__group-field {
  margin-top: 4px;

  &--right {
    text-align: right;
  }

  &--mt8 {
    margin-top: 8px;
  }

  &--mt12 {
    margin-top: 12px;
  }

  &--ml22 {
    margin-left: 22px;
  }

  &--disabled {
    color: $color-disable-text;
  }
}

.AppForm__group-field--mt16 {
  margin-top: 16px;
}

.AppForm__description {
  margin-top: 4px;
}

.AppForm__sub-group {
  & + & {
    margin-top: 8px;
  }
}

.AppForm__sub-group-hint {
  @include text-caption;
  color: inherit;
  opacity: 0.7;
  margin-top: 4px;
}

.AppForm__sub-group-item {
  margin-top: 8px;
}

.AppForm__sub-group-title {
  display: block;
  padding-bottom: 4px;
}
</style>
