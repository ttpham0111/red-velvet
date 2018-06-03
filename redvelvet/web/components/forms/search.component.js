Vue.component('r-search-form', {
  template: `
    <b-form>
      <b-input-group :size="size">
        <b-form-input ref="search" :value="value" @input="$emit('input', $event)"></b-form-input>
        <b-input-group-text slot="append">
          <i class="fas fa-search"></i>
        </b-input-group-text>
      </b-input-group>
    </b-form>
  `,

  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md'
    }
  },

  methods: {
    focus: function() {
      this.$refs.search.focus();
    }
  }
});
