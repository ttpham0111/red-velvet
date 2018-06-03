Vue.component('r-key-list', {
  mixins: [keyListItemMixin],

  template: `
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="connection-header p-1" role="tab" @click="initKeys">
        <b-btn block href="#" v-b-toggle="id"
               :variant="expanded ? 'danger' : 'secondary'"
               class="d-flex text-left">
          <div class="connection-label mr-1">
            <span><i class="fas fa-database"></i></span>
            <span>{{ connection.label }} ({{ connection.uri }})</span>
          </div>
          
          <r-toolbar v-if="expanded" size="sm" class="ml-1"
                     :show-search="showSearch" @search="toggleSearch"
                     :auto-refresh="autoRefresh" @auto-refresh="toggleAutoRefresh"
                     @create="createKey" @refresh="getKeys" @connect="$emit('connect')"></r-toolbar>
        </b-btn>
        
        <r-search-form ref="keySearch" v-show="showSearch" size="sm"
                       v-model="search" class="mt-1"></r-search-form>
      </b-card-header>
      <b-collapse :id="id" role="tabpanel" v-model="expanded"
                  @hide="onCollapse">
        <b-card-body class="p-2">
          <span v-show="loading">Loading...</span>
          <ol class="mb-0 pl-0">
            <r-key-list-item v-for="(child, i) in sortedChildren" :key="child.path"
                             :id="id + '-item-' + i" :tree="child" :key-type-mapping="keyTypeMapping"
                             @select="$emit('select', {name: $event, type: keyTypeMapping[$event]})"
                             @delete="deleteKeys"></r-key-list-item>
          </ol>
        </b-card-body>
      </b-collapse>
    </b-card>
  `,

  props: {
    id: String,
    connection: Object
  },

  data: function() {
    return {
      keys: [],
      search: '',

      expanded: false,
      showSearch: false,
      autoRefresh: false,
      loading: false
    };
  },

  computed: {
    filteredKeys: function() {
      if (this.loading) return [];
      if (this.search === '') return this.keys;
      let search = RegExp(this.search);
      return this.keys.filter((key) => {
        return search.test(key.name);
      });
    },

    tree: function() {
      let tree = {children: {}};
      this.filteredKeys.forEach(key => {
        this.addChild(tree, key.name);
      });
      return tree;
    },

    keyTypeMapping: function() {
      let keyTypeMapping = {};
      this.keys.forEach(key => {
        keyTypeMapping[key.name] = key.type;
      });
      return keyTypeMapping;
    },

    sortedChildren: function() {
      return Object.values(this.tree.children).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  },

  methods: {
    addChild: function(tree, key) {
      let fields = key.split(':');
      if (fields[0] === '') return;

      let group = fields[0];
      if (!tree.children.hasOwnProperty(group)) {
        tree.children[group] = {
          name: group,
          path: tree.path ? tree.path + ':' + group : group,
          children: {},
          numDescendents: 0
        };
      }

      this.addChild(tree.children[group], fields.slice(1).join(':'));
      tree.numDescendents += 1;
    },

    initKeys: function() {
      if (this.keys.length === 0) this.getKeys();
    },

    getKeys: function() {
      this.loading = true;
      return redisService.getKeys(this.connection.label)
        .then(keys => {
          this.keys = keys;
          this.loading = false;
        });
    },

    createKey: function() {
      formService.getKeyData(formService.KeyFormMode.CREATE_KEY)
        .then(formData => {
          this.loading = true;
          return redisService.createKey(this.connection.label, formData)
        })
        .then(this.getKeys)
        .catch(() => {});
    },

    deleteKeys: function(keyPrefix) {
      const toDelete = this.keys.map(key => key.name).filter(key => key.startsWith(keyPrefix)).sort();
      this.$confirm(createElement => this.renderConfirmMessage(createElement, toDelete),
                    'Delete ' + toDelete.length + ' key(s)?', 'Delete Key(s)')
        .then(() => {
          this.loading = true;
          return Promise.all(toDelete.map(key => redisService.deleteKey(this.connection.label, key)))
        })
        .then(() => {
          this.$emit('delete', toDelete);
          this.getKeys();
        })
        .catch(() => {});
    },

    renderConfirmMessage: function(createElement, keys) {
      if (keys.length > 10) {
        return createElement('p', [
          'This action will delete ',
          createElement('strong', keys.length),
          ' key(s)!'
        ]);
      }

      return createElement('div', [
        createElement('p', 'Delete the following key(s)?'),
        createElement('ul', keys.map(key => createElement('li', key)))
      ]);
    },

    toggleSearch: function() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => {
          this.$refs.keySearch.focus();
        });
      } else {
        this.search = '';
      }
    },

    toggleAutoRefresh: function() {
      this.autoRefresh = !this.autoRefresh;
      if (this.autoRefresh) {
        console.log('auto refresh');
      } else {
        console.log('disable auto refresh')
      }
    },

    onCollapse: function() {
      if (this.showSearch) this.toggleSearch();
      if (this.autoRefresh) this.toggleAutoRefresh();
    }
  }
});
