Vue.component('r-command-line', {
  template: `
    <ul ref="commandLine" class="list-unstyled" @click="focus">
      <li v-for="command in commandBuffer.commands">
        <output>
          <label class="mr-2 mb-0">{{ connection.label }}></label>{{ command.command }}
        </output>
        <r-command-line-output class="d-block" :value="command.result"></r-command-line-output>
      </li>
      
      <li class="d-flex">
        <label class="mr-2 mb-0">{{ connection.label }}></label>
        <r-command-line-prompt ref="prompt" class="flex-grow-1" @submit="execute"></r-command-line-prompt>  
      </li>
    </ul>
  `,

  props: {
    connection: Object,
    bufferSize: {
      type: Number,
      default: 50
    }
  },

  data: function() {
    return {
      commandBuffer: new CommandBuffer(this.bufferSize)
    }
  },

  mounted: function() {
    redisService.connect(this.connection.label, this.onMessage);
  },

  beforeDestroy: function() {
    redisService.disconnect(this.connection.label);
  },

  methods: {
    execute: function(command) {
      redisService.execute(this.connection.label, command);
    },

    onMessage: function(message) {
      this.commandBuffer.push(new Command(message));
      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.commandLine.scrollTop = this.$refs.commandLine.scrollHeight;
      })
    },

    focus: function() {
      // Prevents highlighting from causing click events
      if (getSelection().isCollapsed) this.$refs.prompt.focus();
    }
  }
});
