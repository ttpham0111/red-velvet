Vue.component('r-key-view', {
  template: `
    <div role="tablist">
      <r-key-list v-for="(connection, i) in sortedConnections" :key="connection.label"
                  :id="'key-list-' + i" :connection="connection"
                  @connect="$emit('connect', connection)"
                  @select="$emit('select', connection.label, $event)"
                  @delete="$emit('delete', connection.label, $event)"></r-key-list>
    </div>
  `,

  props: {
    connections: Array
  },

  computed: {
    sortedConnections: function() {
      return this.connections.slice(0).sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });
    }
  }
});
