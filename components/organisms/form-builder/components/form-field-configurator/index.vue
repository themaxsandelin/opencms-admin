<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Configure field</span>
      </v-card-title>

      <v-card-text>
        <configuration-field v-for="(field, i) in fields" :key="i" :field="field" :config="{ value: config[field.key] || '' }" @update="fieldUpdate" />

        <v-checkbox label="Field is always required" :value="values.alwaysRequired || false" @change="fieldUpdate({ key: 'alwaysRequired', value: $event })" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Cancel</v-btn>
        <v-btn color="primary" :disabled="!changesMade" @click="saveChanges">Save changes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import ConfigurationField from './components/configuration-field';

  export default {
    name: 'FormFieldConfigurator',
    components: {
      ConfigurationField,
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      fields: {
        type: Array,
        required: true
      },
      values: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        config: {...this.values}
      };
    },
    computed: {
      changesMade() {
        return JSON.stringify(this.values) !== JSON.stringify(this.config);
      },
    },
    watch: {
      values() {
        this.$set(this.$data, 'config', this.values);
      }
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      fieldUpdate({ key, value }) {
        const config = {...this.config};
        config[key] = value;
        this.$set(this.$data, 'config', config);
      },
      saveChanges() {
        this.$emit('save', this.config);
      }
    }
  };
</script>
