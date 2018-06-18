Vue.component('r-command-line-prompt', {
  template: `
    <b-form class="command-line-prompt" @submit="onSubmit">
      <input ref="prompt" type="text" v-model="command" class="w-100"
             @keydown.up="command = history.prev()"
             @keydown.down="command = history.next()" />
    </b-form>
  `,

  props: {
    historyBufferSize: {
      type: Number,
      default: 50
    }
  },

  data: function() {
    return {
      command: '',
      history: new CommandHistory(this.historyBufferSize)
    }
  },

  methods: {
    focus: function() {
      this.$refs.prompt.focus();
    },

    onSubmit: function() {
      if (this.command) {
        this.$emit('submit', this.command);
        this.history.push(this.command);
        this.command = '';
      }
    }
  }
});
