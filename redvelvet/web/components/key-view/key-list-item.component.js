Vue.component('r-key-list-item', {
  mixins: [keyListItemMixin],

  template: `
    <li class="d-flex flex-column">
      <a v-b-toggle="id" href="#" class="key-list-item d-flex" @click="onSelect">
        <span v-html="icon"></span>
        <span class="key-list-item-label">
          {{ tree.name }}
          <small v-if="isDir">({{ tree.numDescendents }})</small>
        </span>
        <span class="ml-auto d-flex align-items-center px-1">
          <b-btn size="sm" variant="outline-danger"
                 class="py-0 border-0 show-only-on-hover"
                 @click.stop="onDelete">
            <i class="fas fa-trash"></i>
          </b-btn>
        
          <b-btn v-if="hasGrandchildren" size="sm" variant="outline-secondary"
                 class="py-0 border-0"
                 @click.stop="expandChildren">
            <i class="fas fa-angle-double-down"></i>
          </b-btn>
        </span>
      </a>
      
      <b-collapse :id="id" v-model="expanded">
        <ol v-if="isDir" class="key-list">
          <r-key-list-item v-for="(child, i) in sortedChildren" :key="child.path" ref="children"
                           :id="id + '-' + i" :tree="child" :key-type-mapping="keyTypeMapping"
                           :type-icon-mapping="typeIconMapping"
                           @select="$emit('select', $event)" @delete="$emit('delete', $event)"></r-key-list-item>
        </ol>
      </b-collapse>
    </li>
  `,

  props: {
    id: String,
    tree: Object,

    keyTypeMapping: Object,
    typeIconMapping: {
      default: function() {
        const Type = redisService.KeyType;
        let iconMapping = {'DIR': '<i class="fas fa-fw fa-folder"></i>'};
        iconMapping[Type.STRING] = '<i class="fas fa-fw" style="font-family: inherit;">"</i>';
        iconMapping[Type.LIST] = '<i class="fas fa-fw fa-bars"></i>';
        iconMapping[Type.SET] = '<i class="fas fa-fw" style="font-family: inherit;">{}</i>';
        iconMapping[Type.ZSET] = '<i class="fas fa-fw" style="font-family: inherit;">()</i>';
        iconMapping[Type.HASH] = '<i class="fas fa-fw fa-hashtag"></i>';
        return iconMapping;
      }
    }
  },

  data: function() {
    return {
      expanded: false
    };
  },

  computed: {
    isDir: function() {
      return Object.keys(this.tree.children).length > 0;
    },

    isKey: function() {
      return !this.isDir;
    },

    hasGrandchildren: function() {
      return Object.values(this.tree.children).some(child => Object.keys(child.children).length > 0);
    },

    icon: function() {
      let type = this.isDir ? 'DIR' : this.keyTypeMapping[this.tree.path];
      return this.typeIconMapping[type];
    }
  },

  methods: {
    expandChildren: function() {
      this.expanded = true;
      if (this.$refs.children) this.$refs.children.forEach(child => child.expandChildren());
    },

    onSelect: function() {
      if (this.isKey) this.$emit('select', this.tree.path);
    },

    onDelete: function() {
      let path = this.tree.path;
      if (this.isDir) path += ':';
      this.$emit('delete', path)
    }
  }
});
