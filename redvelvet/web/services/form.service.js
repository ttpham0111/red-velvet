class FormService {
  constructor() {
    this.forms = {};
  }

  registerKeyForm(form) {
    this.forms.keyForm = form;
  }

  get KeyFormMode() {
    return this.forms.keyForm.Mode;
  }

  getKeyData(mode, key, type, value) {
    const form = this.forms.keyForm;
    form.set(mode, key, type, value);
    form.show();

    return new Promise((resolve, reject) => {
      form.onOk(resolve);
      form.onCancel(reject);
    });
  }
}

const formService = new FormService();
