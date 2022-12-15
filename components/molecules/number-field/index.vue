<template>
  <v-text-field
    :value="value"
    :label="label"
    type="number"
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
        type: Number,
        default: undefined
      }
    },
    methods: {
      input(value) {
        this.$emit('update', value ? parseInt(value) : undefined);
      }
    }
  };
</script>
