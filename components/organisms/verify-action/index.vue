<template>
  <v-dialog :value="visible" max-width="560px" @click:outside="hideDialog" @keydown.esc="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-btn text @click="abort">{{ cancelLabel }}</v-btn>
        <v-btn :color="type === 'warning' ? 'error' : 'primary'" :loading="loading" @click="confirm">{{ confirmLabel}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'VerifyAction',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        required: true,
        validator: (value) => ['warning', 'confirm'].includes(value)
      },
      title: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      cancelLabel: {
        type: String,
        default: 'Cancel'
      },
      confirmLabel: {
        type: String,
        default: 'Confirm'
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      abort() {
        this.$emit('abort');
      },
      confirm() {
        this.$emit('confirm');
      }
    }
  };
</script>
