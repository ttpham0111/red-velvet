Vue.component('r-toolbar', {
  template: `
    <div class="d-flex align-items-center">
      <b-btn v-if="!disableTerminal" :size="size" variant="secondary" class="mr-1 py-0 px-1"
             @click.stop="$emit('connect')">
        <i class="fas fa-terminal"></i>
      </b-btn>
      <b-btn v-if="!disableSearch" :size="size" variant="info"  class="mr-1 py-0 rounded-circle fa-circle-btn"
             :pressed="showSearch" @click.stop="$emit('search')">
        <i class="fas fa-fw fa-search"></i>
      </b-btn>
      <b-btn v-if="!disableCreate" :size="size" variant="success" class="mr-1 py-0 rounded-circle fa-circle-btn"
             @click.stop="$emit('create')">
        <i class="fas fa-fw fa-plus"></i>
      </b-btn>
      <b-btn :size="size" variant="success" class="mr-1 py-0 rounded-circle fa-circle-btn"
             @click.stop="$emit('refresh')">
        <i class="fas fa-fw fa-sync-alt"></i>
      </b-btn>
      <a class="d-flex" @click.stop>
        <toggle-button :value="autoRefresh" :labels="{unchecked: 'auto-refresh', checked: 'auto-refresh'}"
                       class="mb-0" :width="toggleButtonWidth" :height="toggleButtonHeight"
                       @change="$emit('auto-refresh')" />
      </a>
    </div>
  `,

  props: {
    size: {
      type: String,
      default: 'md'
    },

    disableTerminal: {
      type: Boolean,
      default: false
    },

    disableSearch: {
      type: Boolean,
      default: false
    },

    disableCreate: {
      type: Boolean,
      default: false
    },

    showSearch: {
      type: Boolean,
      default: false
    },

    autoRefresh: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    toggleButtonWidth: function() {
      switch (this.size) {
        case 'sm': return 99;
        case 'md': return 101;
        case 'lg': return 103;
      }
    },

    toggleButtonHeight: function() {
      switch (this.size) {
        case 'sm': return 24;
        case 'md': return 26;
        case 'lg': return 28;
      }
    }
  }
});
