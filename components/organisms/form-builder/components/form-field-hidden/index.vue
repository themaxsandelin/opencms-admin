<template>
  <div class="form-field-hidden">
    <label>Hidden field:</label>
    <input type="text" disabled :value="config.key" />
  </div>
</template>

<script>
  export default {
    name: 'FormFieldHidden',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
