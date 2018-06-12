Vue.component('r-value-view', {
  template: `
    <b-card v-show="hasTabs" no-body class="value-view rounded-0">
      <b-tabs card small>
        <b-tab v-for="(value, keyId, i) in loaded" :key="keyId"
               title-link-class="btn-danger pr-2">
          <template slot="title">
            <span>{{ keyId }}</span>
            <b-button-close class="pl-2" @click="$delete(loaded, keyId)"></b-button-close>
          </template>
          
          <r-value-string-view v-if="value.type === KeyType.STRING"
                               :value="value" @refresh="onRefresh(keyId)"></r-value-string-view>
          <r-value-list-view v-else-if="value.type === KeyType.LIST"
                             :value="value" @refresh="onRefresh(keyId)"></r-value-list-view>
          <r-value-set-view v-else-if="value.type === KeyType.SET"
                            :value="value" @refresh="onRefresh(keyId)"></r-value-set-view>
          <r-value-zset-view v-else-if="value.type === KeyType.ZSET"
                             :value="value" @refresh="onRefresh(keyId)"></r-value-zset-view>
          <r-value-hash-view v-else-if="value.type === KeyType.HASH"
                             :value="value" @refresh="onRefresh(keyId)"></r-value-hash-view>
        </b-tab>
      </b-tabs>
    </b-card>
  `,

  data: function() {
    return {
      loaded: {}
    };
  },

  computed: {
    KeyType: function() {
      return redisService.KeyType;
    },

    hasTabs: function() {
      return Object.keys(this.loaded).length > 0;
    }
  },

  methods: {
    getValue: function(keyData, refresh) {
      const keyId = keyData.connectionLabel + '::' + keyData.key.name;
      if (this.loaded.hasOwnProperty(keyId) && !refresh) return;

      let valueData = {
        connectionLabel: keyData.connectionLabel,
        key: keyData.key.name,
        type: keyData.key.type,
        value: null
      };
      this.$set(this.loaded, keyId, valueData);

      redisService.getValues(keyData.connectionLabel, keyData.key.name, keyData.key.type)
        .then(value => {
          valueData.value = value;
        });
    },

    deleteValues: function(connectionLabel, keys) {
      keys.forEach(key => this.$delete(this.loaded, connectionLabel + '::' + key));
    },

    onRefresh: function(keyId) {
      const value = this.loaded[keyId];
      let keyData = {
        connectionLabel: value.connectionLabel,
        key: {name: value.key, type: value.type}
      };
      this.getValue(keyData, true);
    }
  }
});
