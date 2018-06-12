Vue.component('r-value-string-view', {
  template: `
    <div>
      <template v-if="value.value === null">Loading...</template>
      <template v-else>
        <b-row>
          <b-col class="mb-2 d-flex align-items-end justify-content-lg-end">
            <r-toolbar disable-terminal disable-search disable-create
                       @refresh="$emit('refresh')"
                       :auto-refresh="autoRefresh" @auto-refresh="toggleAutoRefresh"></r-toolbar>
          </b-col>
        </b-row>
        
        <b-table small fixed striped hover responsive bordered
                 thead-class="bg-danger text-light"
                 :items="items" :fields="fields"
                 @row-dblclicked="editValue"></b-table>
      </template>
    </div>
  `,

  props: {
    value: Object
  },

  data: function() {
    return {
      fields: [{key: 'value'}],
      autoRefresh: false
    };
  },

  computed: {
    items: function() {
      return [this.value];
    }
  },

  methods: {
    toggleAutoRefresh: function() {
      this.autoRefresh = !this.autoRefresh;
      if (this.autoRefresh) {
        console.log('auto refresh');
      } else {
        console.log('disable auto refresh')
      }
    },

    editValue: function(item) {
      formService.getKeyData(formService.KeyFormMode.UPDATE_VALUE, this.value.key, this.value.type, item)
        .then(formData => {
          this.value.value = null;
          return redisService.createOrUpdateValue(this.value.connectionLabel,
                                                  formData.key, formData.type, formData.value);
        })
        .then(() => this.$emit('refresh'))
        .catch(() => {});
    }
  }
});
