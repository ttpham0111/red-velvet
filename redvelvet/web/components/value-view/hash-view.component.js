Vue.component('r-value-hash-view', {
  extends: Vue.component('r-value-list-view'),

  data: function() {
    return {
      fields: [
        {key: 'field', thStyle: {width: '25%'}, sortable: true},
        {key: 'value', thStyle: {width: '75%'}, sortable: true},
      ]
    }
  },

  computed: {
    items: function() {
      return Object.keys(this.value.value).map(field => {
        return {field: field, value: this.value.value[field]};
      });
    }
  }
});
