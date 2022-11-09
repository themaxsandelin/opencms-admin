<template>
  <div class="form-builder">
    <div class="form-builder__fields">
      <form-field
        v-for="(field, i) in fields"
        :key="i"
        :first="i === 0"
        :last="i === (fields.length - 1)"
        :field="field"
        @move="moveField(i, $event)"
        @remove="removeField(i)"
        @configure="configureField(i)"
      />
    </div>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <button class="form-builder__add-field" v-bind="attrs" v-on="on" @click="showFieldSelector">
          <v-icon>mdi-plus</v-icon>
        </button>
      </template>
      <span>Add new field</span>
    </v-tooltip>


    <form-field-selector :visible="formFieldSelectorVisible" @hide="hideFieldSelector" @selection="fieldSelection" />
    <form-field-configurator
      :fields="configFields"
      :values="configValues"
      :visible="formFieldConfiguratorVisible"
      @hide="hideFieldConfigurator"
      @save="fieldConfigurationSave"
    />
  </div>
</template>

<script>
  // Internal components
  import FormField from './components/form-field';
  import FormFieldConfigurator from './components/form-field-configurator';

  // Components
  import FormFieldSelector from '@/components/organisms/form-field-selector';

  export default {
    name: 'FormBuilder',
    components: {
      FormField,
      FormFieldSelector,
      FormFieldConfigurator
    },
    props: {
      fields: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        formFieldSelectorVisible: false,
        formFieldConfiguratorVisible: false,
        activeFieldIndex: -1,
        localFields: [...this.fields]
      };
    },
    computed: {
      configFields() {
        if (this.activeFieldIndex === -1) {
          return [];
        }
        return this.fields[this.activeFieldIndex].configFields;
      },
      configValues() {
        if (this.activeFieldIndex === -1) {
          return {};
        }
        if (!this.fields[this.activeFieldIndex].config) {
          return {};
        }
        return this.fields[this.activeFieldIndex].config;
      }
    },
    watch: {
      fields() {
        this.$set(this.$data, 'localFields', this.fields);
      }
    },
    methods: {
      showFieldSelector() {
        this.$set(this.$data, 'formFieldSelectorVisible', true);
      },
      hideFieldSelector() {
        this.$set(this.$data, 'formFieldSelectorVisible', false);
      },
      showFieldConfigurator() {
        this.$set(this.$data, 'formFieldConfiguratorVisible', true);
      },
      hideFieldConfigurator() {
        this.$set(this.$data, 'formFieldConfiguratorVisible', false);
        this.$set(this.$data, 'activeFieldIndex', -1);
      },
      moveField(index, direction) {
        const fields = [...this.localFields];

        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === (fields.length - 1)) return;

        const newIndex = index + (direction === 'up' ? -1 : 1);
        const [item] = fields.splice(index, 1);
        fields.splice(newIndex, 0, item);
        this.$set(this.$data, 'localFields', fields);
        this.$emit('update', this.localFields);
      },
      removeField(index) {
        const fields = [...this.localFields];
        fields.splice(index, 1);
        this.$set(this.$data, 'localFields', fields);
        this.$emit('update', this.localFields);
      },
      fieldSelection(field) {
        const fields = [...this.localFields];
        fields.push(field);
        this.$set(this.$data, 'localFields', fields);
        this.configureField(this.localFields.length - 1);
        this.$emit('update', this.localFields);
      },
      configureField(index) {
        this.$set(this.$data, 'activeFieldIndex', index);
        this.showFieldConfigurator();
      },
      fieldConfigurationSave(config) {
        const field = {...this.localFields[this.activeFieldIndex]};
        field.config = config;
        this.$set(this.$data.localFields, this.activeFieldIndex, field);
        this.hideFieldConfigurator();
        this.$set(this.$data, 'activeFieldIndex', -1);
        this.$emit('update', this.localFields);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
