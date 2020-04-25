export default {
  model: {
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentValue: this.value || '',
      isNullable: this.value === null
    };
  },
  watch: {
    value() {
      this.currentValue = this.value || '';
      if (this.value === null) this.isNullable = true;
    }
  },
  methods: {
    change(newValue) {
      if (this.currentValue === newValue) return;

      this.currentValue = newValue;
      this.$emit(
        'change',
        this.isNullable && !this.currentValue ? null : this.currentValue
      );
    },
    trimAndBlur() {
      const newValue = this.currentValue.trim();
      if (this.currentValue !== newValue) this.change(newValue);
      this.blur();
    },
    blur() {
      this.$emit('blur');
    }
  }
};
