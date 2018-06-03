Vue.component('r-confirm', {
  mixins: [confirmObserversMixin],

  render: function(createElement) {
    const modalData = {
      ref: 'modal',
      props: {
        title: this.title,
        okTitle: this.okTitle,
        cancelTitle: this.cancelTitle,
        okVariant: 'danger',
        headerBgVariant: 'danger',
        headerTextVariant: 'light'
      },
      on: {
        ok: this.callOkHandlers,
        cancel: this.callCancelHandlers
      }
    };

    return createElement('b-modal', modalData, [
      typeof this.message === 'function' ? this.message(createElement) : createElement('p', this.message)
    ]);
  },

  props: {
    defaultMessage: {
      type: String,
      default: 'Are you sure?'
    },

    defaultTitle: {
      type: String,
      default: 'Are you sure?'
    },

    defaultOkTitle: {
      type: String,
      default: 'OK'
    },

    defaultCancelTitle: {
      type: String,
      default: 'Cancel'
    }
  },

  data: function() {
    return {
      message: '',
      title: '',
      okTitle: '',
      cancelTitle: ''
    };
  },

  methods: {
    update: function(message, title, okTitle, cancelTitle) {
      this.message = message || this.defaultMessage;
      this.title = title || this.defaultTitle;
      this.okTitle = okTitle || this.defaultOkTitle;
      this.cancelTitle = cancelTitle || this.defaultCancelTitle;
    },

    show: function() {
      this.$refs.modal.show();
    }
  }
});
