class Confirm {
  constructor(modal) {
    this.modal = modal;
  }

  install(Vue, options) {
    Vue.prototype.$confirm = (message, title, okTitle, cancelTitle) => {
      return this.confirm(message, title, okTitle, cancelTitle);
    }
  }

  confirm(message, title, okTitle, cancelTitle) {
    this.modal.update(message, title, okTitle, cancelTitle);
    this.modal.show();
    return new Promise((resolve, reject) => {
      this.modal.onOk(resolve);
      this.modal.onCancel(reject);
    });
  }
}
