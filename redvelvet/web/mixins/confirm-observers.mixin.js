const confirmObserversMixin = {
  data: function() {
    return {
      okHandlers: [],
      cancelHandlers: []
    }
  },

  methods: {
    onOk: function(handler) {
      this.okHandlers.push(handler);
    },

    onCancel: function(hander) {
      this.cancelHandlers.push(hander);
    },

    callOkHandlers: function(res) {
      this.okHandlers.forEach(handler => handler(res));
    },

    callCancelHandlers: function(err) {
      this.cancelHandlers.forEach(handler => handler(err));
    }
  }
}