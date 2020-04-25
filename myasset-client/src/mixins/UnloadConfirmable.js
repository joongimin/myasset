export default {
  data() {
    return { beforeunloadHandler: null };
  },
  methods: {
    enableUnloadConfirmation() {
      if (this.beforeunloadHandler) return;

      this.beforeunloadHandler = event => {
        event.preventDefault();
        event.returnValue = '';
      };
      window.addEventListener('beforeunload', this.beforeunloadHandler);
    },
    disableUnloadConfirmation() {
      if (!this.beforeunloadHandler) return;

      window.removeEventListener('beforeunload', this.beforeunloadHandler);
      this.beforeunloadHandler = null;
    }
  },
  beforeDestroy() {
    this.disableUnloadConfirmation();
  }
};
