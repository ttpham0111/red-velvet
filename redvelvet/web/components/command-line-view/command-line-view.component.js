Vue.component('r-command-line-view', {
  template: `
    <b-card v-show="hasConnections" no-body class="rounded-0">
      <b-tabs v-model="activeTab" card small
              class="d-flex flex-column h-100" content-class="flex-grow-1 bg-dark text-white">
        <!-- Not using key on purpose to force re-render of new sort order-->
        <b-tab v-for="(connection, i) in sortedConnections"
               title-link-class="btn-danger pr-2" class="p-0">
          <template slot="title">
            <span>{{ connection.label }}</span>
            <b-button-close class="pl-2" @click="close(connection.label)"></b-button-close>
          </template>
          
          <r-command-line :connection="connection"
                          class="command-line align-text-bottom overflow-scroll mb-0 p-2"></r-command-line>
        </b-tab>
      </b-tabs>
    </b-card>
  `,

  data: function() {
    return {
      connections: {},
      activeTab: 0
    };
  },

  computed: {
    hasConnections: function() {
      return this.sortedConnections.length > 0;
    },

    sortedConnections: function() {
      return Object.values(this.connections).sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });
    }
  },

  methods: {
    show: function(connection) {
      this.$set(this.connections, connection.label, connection);
      this.$nextTick(() => {
        this.activeTab = this.sortedConnections.indexOf(connection);
      });
    },

    close: function(connectionLabel) {
      this.$delete(this.connections, connectionLabel);
    }
  }
});
