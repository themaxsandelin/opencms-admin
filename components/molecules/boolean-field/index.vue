<template>
  <v-checkbox
    :input-value="value"
    :label="label"
    @change="change"
  />
</template>

<script>
  export default {
    name: 'BooleanField',
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      change(value) {
        this.$emit('update', value || false);
      }
    }
  };
</script>
