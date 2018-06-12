Vue.component('r-app', {
  template: `
    <b-container fluid>
      <r-key-form ref="keyForm"></r-key-form>
      
      <r-navbar></r-navbar>
      
      <b-row class="h-md-100">
        <b-col md="6" lg="5" xl="4" class="h-md-100 py-3 border-right">
          <r-key-view class="h-md-100 overflow-scroll" :connections="connections"
                      @connect="showCommandLine" @select="showValueTab"
                      @delete="deleteValueTab"></r-key-view>
        </b-col>
          
        <b-col md="6" lg="7" xl="8" class="h-md-100 px-0 d-flex flex-column">
          <r-value-view ref="valueView" class="flex-grow-1 overflow-scroll"></r-value-view>
          
          <r-command-line-view ref="commandLineView"></r-command-line-view>
        </b-col>
      </b-row>
    </b-container>
  `,

  data: function () {
    return {
      connections: [],

      loading: false
    };
  },

  mounted: function() {
    formService.registerKeyForm(this.$refs.keyForm);

    this.loading = true;
    this.getConnections()
      .then(() => this.loading = false);
  },

  methods: {
    getConnections: function() {
      return redisService.getConnections()
        .then(connections => {
          this.connections = connections;
        });
    },

    showCommandLine: function(connectionLabel) {
      this.$refs.commandLineView.show(connectionLabel);
    },

    showValueTab: function(connectionLabel, key) {
      const keyData = {connectionLabel: connectionLabel, key: key};
      this.$refs.valueView.getValue(keyData);
    },

    deleteValueTab: function(connectionLabel, keys) {
      this.$refs.valueView.deleteValues(connectionLabel, keys);
    }
  }
});
