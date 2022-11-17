<template>
  <div class="form-field-file">
    <label v-if="label">{{ label }}</label>
    <input type="file">
  </div>
</template>

<script>
  export default {
    name: 'InputFieldFile',
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
