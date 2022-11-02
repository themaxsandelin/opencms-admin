<template>
  <v-select :items="options" :label="label" required :value="value" @change="change" />
</template>

<script>
  export default {
    name: 'SelectField',
    props: {
      label: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        required: true
      },
      value: {
        type: String,
        default: ''
      }
    },
    methods: {
      change(value) {
        this.$emit('update', value);
      }
    }
  };
</script>
