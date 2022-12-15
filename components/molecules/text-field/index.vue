<template>
  <v-text-field
    :value="value"
    :label="label"
    type="text"
    hide-details
    single-line
    @input="input"
  />
</template>

<script>
  export default {
    name: 'NumberField',
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    methods: {
      input(value) {
        this.$emit('update', value);
      }
    }
  };
</script>
