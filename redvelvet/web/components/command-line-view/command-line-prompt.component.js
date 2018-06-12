Vue.component('r-command-line-prompt', {
  template: `
    <b-form class="command-line-prompt" @submit="onSubmit">
      <input ref="prompt" type="text" v-model="command" class="w-100" />
    </b-form>
  `,

  data: function() {
    return {
      command: ''
    }
  },

  methods: {
    focus: function() {
      this.$refs.prompt.focus();
    },

    onSubmit: function() {
      if (this.command) {
        this.$emit('submit', this.command);
        this.command = '';
      }
    }
  }
});
