Vue.component('r-value-zset-view', {
  extends: Vue.component('r-value-list-view'),

  data: function() {
    return {
      fields: [
        {key: 'score', thStyle: {width: '25%'}, sortable: true},
        {key: 'value', thStyle: {width: '75%'}, sortable: true},
      ]
    }
  },

  computed: {
    items: function() {
      return this.value.value.map(value => {
        return {score: value[1], value: value[0]};
      });
    }
  }
});
