<template>
  <TheLoginView :is-loading="isSubmitting">
    <AppForm
      id="user"
      v-bind="formProps"
      object-id="user"
      focus-group-id="email"
      form-style="wide"
      validate-only-on-submit
      no-screen
      :submit-button="{
        submitLabel: $t('login'),
        submittingLabel: $t('logging_in')
      }"
      v-on="formEvents"
    >
      <input type="hidden" name="user[remember_me]" value="1" />
    </AppForm>
  </TheLoginView>
</template>

<script>
import FormView from '@/mixins/FormView';
import TheLoginView from './TheLoginView';

export default {
  name: 'TheLogin',
  components: { TheLoginView },
  mixins: [FormView],
  data() {
    return {
      formObject: { email: '', password: '' },
      detectFormDataChange: false
    };
  },
  computed: {
    formSections() {
      return [
        {
          groups: [
            {
              id: 'email',
              label: this.$t('app.email'),
              placeholder: this.$t('app.email'),
              type: 'email',
              autocomplete: 'username',
              required: false,
              validate: ['required', 'email_format']
            },
            {
              id: 'password',
              label: this.$t('app.password'),
              placeholder: this.$t('app.password'),
              type: 'password',
              autocomplete: 'current-password',
              required: false,
              validate: ['required']
            }
          ]
        }
      ];
    }
  }
};
</script>

<i18n locale="en">
{
  "email_placeholder": "Email",
  "login": "Sign in",
  "logging_in": "Signing in.."
}
</i18n>
