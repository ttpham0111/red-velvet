Vue.component('r-command-line-output', {
  render: function(createElement) {
    return this.renderOutput(createElement, this.value);
  },

  props: {
    value: [String, Number, Array, Object]
  },

  methods: {
    renderOutput: function(createElement, value) {
      if (value instanceof Array) {
        return createElement('ul', {class: 'list-unstyled'}, value.slice().sort().map((item, i) => {
          return createElement('li', i + 1 + ') ' + item);
        }));
      }
      if (value instanceof Object) {
        return createElement('ul', {class: 'list-unstyled'}, Object.keys(value).sort().map((key, i) => {
          return createElement('li', i + 1 + ') ' + key + ' => ' + value[key]);
        }));
      }
      return createElement('output', value);
    }
  }
});
