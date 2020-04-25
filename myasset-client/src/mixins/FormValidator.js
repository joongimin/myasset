import _ from 'lodash';
import { isEmailFormatValid } from '@/lib/emailFormatValidator';

const Validators = {
  required(value) {
    return value === 0 || (value instanceof Array ? !!value.length : !!value);
  },
  gt(value, { allowed }) {
    return value > allowed;
  },
  gte(value, { allowed }) {
    return value >= allowed;
  },
  lt(value, { allowed }) {
    return value < allowed;
  },
  lte(value, { allowed }) {
    return value <= allowed;
  },
  positive_integer(value) {
    return Number.isInteger(value) && Validators.gt(value, { allowed: 0 });
  },
  min_max_integer(value, { min, max }) {
    return Number.isInteger(value) && min <= value && value <= max;
  },
  email_format(value) {
    return !value || isEmailFormatValid(value);
  },
  max_length(value, { limit }) {
    return value.length <= limit;
  }
};

for (const validatorName of Object.keys(Validators)) {
  if (validatorName !== 'required') {
    const validator = Validators[validatorName];
    Validators[validatorName] = (value, ...args) =>
      [null, undefined, ''].includes(value) || validator(value, ...args);
  }
}

export default {
  props: {
    eventBus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      validationErrors: {}
    };
  },
  computed: {
    hasError() {
      return Object.values(this.validationErrors).some(message => !!message);
    },
    errorSummary() {
      const count = Object.values(this.validationErrors).length;
      return count ? this.$t('validations.summary', { count }) : '';
    },
    fieldOptionsMap() {
      const map = {};
      this.sections.forEach(section =>
        section.groups.forEach(group => {
          map[group.id] = group;
          if (group.fields)
            group.fields.forEach(field => (map[field.id] = field));
        })
      );
      return map;
    }
  },
  watch: {
    errorSummary() {
      this.$emit('error-summary', this.errorSummary);
    },
    fieldOptionsMap() {
      Object.keys(this.validationErrors).forEach(id => this.validateField(id));
    }
  },
  methods: {
    setFieldError(id, error) {
      this.unsetFieldError(id);
      this.$set(this.validationErrors, id, error);
    },
    unsetFieldError(id) {
      const error = this.getFieldError(id);
      if (!error) return;

      if (error.asyncTimer) clearTimeout(error.asyncTimer);
      this.$delete(this.validationErrors, id);
    },
    getFieldError(id) {
      return this.validationErrors[id];
    },
    clearErrors() {
      _.keys(this.validationErrors).forEach(id => this.unsetFieldError(id));
    },
    validateField(id) {
      this.$nextTick(() => this.doValidateField(id));
    },
    doValidateField(id) {
      const fieldOptions = this.fieldOptionsMap[id];

      const rules = (fieldOptions && fieldOptions.validate) || [];
      const value =
        fieldOptions && 'value' in fieldOptions
          ? typeof fieldOptions.value === 'function'
            ? fieldOptions.value()
            : fieldOptions.value
          : this.objectValue(id);

      this.unsetFieldError(id);
      rules
        .map(opt => (typeof opt === 'string' ? { rule: opt } : opt))
        .some(({ rule, ...ruleOptions }) => {
          const validator =
            typeof rule === 'function' ? rule : Validators[rule];
          const isValid = validator(
            'value' in ruleOptions ? ruleOptions.value() : value,
            ruleOptions
          );
          if (!isValid) {
            this.setFieldError(id, {
              errorMessage:
                ruleOptions.errorMessage ||
                (typeof rule === 'string'
                  ? this.$t(`validations.${rule}`, ruleOptions)
                  : ''),
              ...ruleOptions
            });
            return true;
          }
        });
    }
  }
};
