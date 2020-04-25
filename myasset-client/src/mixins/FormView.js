import Vue from 'vue';
import _ from 'lodash';
import UnloadConfirmable from '@/mixins/UnloadConfirmable';

export default {
  mixins: [UnloadConfirmable],
  data() {
    return {
      formEventBus: null,
      isSubmitting: false,
      errorSummary: '',
      orgFormObject: {},
      formObject: {},
      detectFormDataChange: true
    };
  },
  computed: {
    formProps() {
      return {
        object: this.formObject,
        eventBus: this.formEventBus,
        isSubmitting: this.isSubmitting,
        errorSummary: this.errorSummary,
        sections: this.formSections,
        isFormDataChanged: this.isFormDataChanged,
        detectFormDataChange: this.detectFormDataChange
      };
    },
    formEvents() {
      return {
        change: this.setFormObject,
        'error-summary': this.setErrorSummary,
        submit: this.submit
      };
    },
    formSections() {
      return [];
    },
    isFormDataChanged() {
      return this.detectFormDataChange
        ? !_.isEqual(this.formObject, this.orgFormObject)
        : false;
    }
  },
  watch: {
    orgFormObject() {
      this.formObject = _.cloneDeep(this.orgFormObject);
    },
    isFormDataChanged(val) {
      if (val) this.enableUnloadConfirmation();
      else this.disableUnloadConfirmation();
    }
  },
  created() {
    this.formEventBus = new Vue();
    if (!_.isEmpty(this.orgFormObject))
      this.formObject = _.cloneDeep(this.orgFormObject);

    if (this.detectFormDataChange) this.enableUnloadConfirmation();
  },
  beforeRouteUpdate(_to, _from, next) {
    this.confirmDiscardChangeOnNavigate(next);
  },
  beforeRouteLeave(_to, _from, next) {
    this.confirmDiscardChangeOnNavigate(next);
  },
  methods: {
    confirmDiscardChangeOnNavigate(next) {
      if (
        this.isFormDataChanged &&
        !confirm(this.$t('app.confirm_discard_change_navigate'))
      ) {
        next(false);
      } else {
        next();
      }
    },
    validateField(...ids) {
      ids
        .filter(v => v)
        .forEach(id => this.formEventBus.$emit('validate-field', id));
    },
    setFieldError(id, error) {
      this.formEventBus.$emit('set-field-error', id, error);
    },
    unsetFieldError(id) {
      this.formEventBus.$emit('unset-field-error', id);
    },
    setFormObject(formObject) {
      this.formObject = formObject;
    },
    setErrorSummary(errorSummary) {
      this.errorSummary = errorSummary;
    },
    submit() {}
  }
};
