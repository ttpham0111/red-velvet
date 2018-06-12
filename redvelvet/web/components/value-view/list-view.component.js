Vue.component('r-value-list-view', {
  template: `
    <div>
      <template v-if="value.value === null">Loading...</template>
      <template v-else>
        <b-row>
          <b-col md="12" lg="6">
            <b-pagination size="md" class="mb-2" v-model="currentPage"
                          :total-rows="totalRows" :per-page="perPage"></b-pagination>
          </b-col>
          <b-col lg="6" class="mb-2 d-flex align-items-end justify-content-lg-end">
            <r-toolbar disable-terminal
                       :show-search="showSearch" @search="toggleSearch"
                       :auto-refresh="autoRefresh" @auto-refresh="toggleAutoRefresh"
                       @create="editValue(Mode.ADD_VALUE)" @refresh="$emit('refresh')"></r-toolbar>
          </b-col>
        </b-row>

        <r-search-form ref="valueSearch" v-show="showSearch" v-model="search"
                       class="mb-2 ml-lg-auto value-search-form"></r-search-form>

        <b-table small striped hover responsive bordered
                 thead-class="bg-danger text-light"
                 :items="filteredItems" :fields="fields"
                 :current-page="currentPage" :per-page="perPage"
                 :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                 @row-dblclicked="editValue(Mode.UPDATE_OR_DELETE_VALUE, $event)"></b-table>
      </template>
    </div>
  `,

  props: {
    value: Object
  },

  data: function() {
    return {
      fields: [{key: 'value', sortable: true}],

      currentPage: 1,
      perPage: 10,
      sortBy: null,
      sortDesc: false,
      search: '',

      showSearch: false,
      showCreateValue: false,
      autoRefresh: false
    };
  },

  computed: {
    Mode: function() {
      return formService.KeyFormMode
    },

    items: function() {
      return this.value.value.map(value => {
        return {value: value};
      });
    },

    filteredItems: function() {
      if (this.search === '') return this.items;
      let search = RegExp(this.search);
      return this.items.filter((item) => {
        return Object.keys(item).some(key => {
          if (key.startsWith('_')) return;
          return search.test(item[key]);
        });
      });
    },

    totalRows: function() {
      return this.filteredItems.length;
    }
  },

  methods: {
    toggleSearch: function() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => {
          this.$refs.valueSearch.focus();
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

    editValue: function(mode, item) {
      formService.getKeyData(mode, this.value.key, this.value.type, item)
        .then(formData => {
          if (!formData) return this.deleteValue(item);

          this.value.value = null;
          let promise = redisService.createOrUpdateValue(this.value.connectionLabel,
                                                         formData.key, formData.type, formData.value);

          if (
            item && (
              (this.value.type === redisService.KeyType.HASH && item.field !== formData.value.field) ||
              (this.value.type !== redisService.KeyType.HASH && item.value !== formData.value.value)
            )
          ) promise = promise.then(() => this.deleteValue(item, true));
          return promise;
        })
        .then(() => this.$emit('refresh'))
        .catch(() => {});
    },

    deleteValue: function(item, skipConfirm) {
      const value = this.value.type === redisService.KeyType.HASH ? item.field : item.value;

      if (skipConfirm) return redisService.deleteValue(this.value.connectionLabel,
                                                       this.value.key, this.value.type, value);

      return this.$confirm('This action will delete "' + value + '"!', 'Delete "' + value + '"?', 'Delete Value')
        .then(() => {
          this.value.value = null;
          return redisService.deleteValue(this.value.connectionLabel, this.value.key, this.value.type, value)
        });
    }
  }
});
