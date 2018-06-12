Vue.component('r-key-form', {
  mixins: [confirmObserversMixin],

  template: `
    <b-modal ref="modal" :title="title" header-bg-variant="danger" header-text-variant="light">
      <b-form ref="form" @submit="onSubmit">
        <b-form-group label="Key" label-for="key">
          <b-form-input id="key" type="text" :disabled="mode !== Mode.CREATE_KEY"
                        v-model="formData.key"></b-form-input>
        </b-form-group>
        
        <b-form-group label="Type" label-for="type">
          <b-form-select id="type" :disabled="mode !== Mode.CREATE_KEY" :options="keyTypes" 
                         v-model="formData.type"/>
        </b-form-group>
        
        <b-form-group v-show="formData.type === KeyType.ZSET" label="Score" label-for="score">
          <b-form-input id="score" type="number" v-model.number="formData.value.score"></b-form-input>
        </b-form-group>
        
        <b-form-group v-show="formData.type === KeyType.HASH" label="Field" label-for="field">
          <b-form-input id="field" type="text" v-model="formData.value.field"></b-form-input>
        </b-form-group>
        
        <b-form-group label="Value" label-for="value">
          <b-form-input id="value" type="text" v-model="formData.value.value"></b-form-input>
        </b-form-group>
      </b-form>
      
      <template slot="modal-footer">
        <b-btn @click="cancel" variant="secondary">Cancel</b-btn>
        <b-btn @click="onSubmit" variant="danger">{{ okTitle }}</b-btn>
        <b-btn v-show="mode === Mode.UPDATE_OR_DELETE_VALUE" @click="deleteValue" variant="danger">
          <i class="fas fa-trash"></i>
        </b-btn>
      </template>
    </b-modal>
  `,

  props: {
    keyTypes: {
      type: Array,
      default: function() {
        const Type = redisService.KeyType;
        return [Type.STRING, Type.LIST, Type.SET, Type.ZSET, Type.HASH];
      },
      validator: function(value) {
        return value.length > 0;
      }
    }
  },

  data: function() {
    const Mode = {
      CREATE_KEY: 0,
      ADD_VALUE: 1,
      UPDATE_VALUE: 2,
      UPDATE_OR_DELETE_VALUE: 3
    };
    return {
      Mode: Mode,

      formData: {},
      mode: Mode.CREATE_KEY
    };
  },

  computed: {
    KeyType: function() {
      return redisService.KeyType;
    },

    title: function() {
      switch (this.mode) {
        case this.Mode.CREATE_KEY:
          return 'Create Key';
        case this.Mode.ADD_VALUE:
          return 'Add Value';
        case this.Mode.UPDATE_VALUE:
        case this.Mode.UPDATE_OR_DELETE_VALUE:
          return 'Update Value';
      }
    },

    okTitle: function() {
      switch (this.mode) {
        case this.Mode.CREATE_KEY:
          return 'Create Key';
        case this.Mode.ADD_VALUE:
          return 'Add Value';
        case this.Mode.UPDATE_VALUE:
        case this.Mode.UPDATE_OR_DELETE_VALUE:
          return 'Update Value';
      }
    }
  },

  created: function() {
    this.clear();
  },

  methods: {
    show: function() {
      this.$refs.modal.show();
    },

    set: function(mode, key, type, value) {
      this.mode = mode;

      if (key !== undefined) this.formData.key = key;
      if (type !== undefined) this.formData.type = type;
      if (value === undefined) return;

      this.formData.value.value = value.value;
      const KeyType = redisService.KeyType;

      switch (this.formData.type) {
        case KeyType.HASH:
          this.formData.value.field = value.field;
          break;
        case KeyType.ZSET:
          this.formData.value.score = value.score;
          break;
      }
    },

    onSubmit: function() {
      const formData = this.formData;
      if (!(formData.key && formData.type && formData.value.value)) return;

      let value = null;
      const KeyType = redisService.KeyType;

      switch (formData.type) {
        case KeyType.STRING:
        case KeyType.LIST:
        case KeyType.SET:
          value = formData.value.value;
          break;
        case KeyType.HASH:
          if (!formData.value.field) return;
          value = {field: formData.value.field, value: formData.value.value};
          break;
        case KeyType.ZSET:
          if (!(formData.value.score === 0 || formData.value.score)) return;
          value = {score: formData.value.score, value: formData.value.value};
          break;
      }

      this.callOkHandlers({
        key: formData.key,
        type: formData.type,
        value: value
      });
      this.$refs.modal.hide();
      this.clear();
    },

    deleteValue: function() {
      this.callOkHandlers();
      this.$refs.modal.hide();
      this.clear();
    },

    cancel: function() {
      this.callCancelHandlers();
      this.$refs.modal.hide();
      this.clear();
    },

    clear: function() {
      this.formData = {
        key: '',
        type: this.keyTypes[0],
        value: {
          score: 0,
          field: '',
          value: ''
        }
      };
    }
  }
});
