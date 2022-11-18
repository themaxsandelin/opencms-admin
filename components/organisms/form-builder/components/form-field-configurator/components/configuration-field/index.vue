<template>
  <div class="configuration-field">
    <localized-input v-if="field.type === 'localized-text'" :value="value" v-bind="field.props" @input="update" />

    <v-text-field v-if="field.type === 'text'" type="text" :value="value" v-bind="field.props" @input="update" />

    <v-select v-else-if="field.type === 'select'" :value="value" :items="field.options" v-bind="field.props" @change="update" />

    <v-text-field v-if="field.type === 'number'" type="number" :value="value" v-bind="field.props" @input="update" />
  </div>
</template>

<script>
  // Components
  import LocalizedInput from '@/components/molecules/localized-input';

  export default {
    name: 'ConfigurationField',
    components: {
      LocalizedInput
    },
    props: {
      field: {
        type: Object,
        required: true
      },
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      value() {
        const value = this.config && this.config.value ? this.config.value : '';
        if (this.field.type === 'localized-text') {
          return value || {};
        } else if (this.field.type === 'select' && this.field.props.multiple) {
          return value ? value.split(', ') : [];
        }
        return value || '';
      }
    },
    mounted() {
      this.checkDefaultValue();
    },
    methods: {
      checkDefaultValue() {
        if (this.field.defaultValue && !this.value) {
          this.update(this.field.defaultValue);
        }
      },
      update(value) {
        if (this.field.type === 'select' && this.field.props.multiple) {
          this.$emit('update', { key: this.field.key, value: value.join(', ') });
        } else {
          this.$emit('update', { key: this.field.key, value });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
