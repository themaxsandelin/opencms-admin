<template>
  <div class="form-field-input">
    <label v-if="label">{{ label }}</label>
    <input type="text" :placeholder="placeholder">
  </div>
</template>

<script>
  export default {
    name: 'FormFieldInput',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      label() {
        const { label } = this.config;
        if (label && label.values) {
          const locales = Object.keys(label.values);
          return label.values[locales.includes('sv-SE') ? 'sv-SE' : locales[0]];
        }
        return '';
      },
      placeholder() {
        const { placeholder } = this.config;
        if (placeholder && placeholder.values) {
          const locales = Object.keys(placeholder.values);
          return placeholder.values[locales.includes('sv-SE') ? 'sv-SE' : locales[0]];
        }
        return '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
