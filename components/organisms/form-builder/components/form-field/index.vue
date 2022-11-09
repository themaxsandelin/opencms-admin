<template>
  <div class="form-field">
    <div class="form-field__header">
      <p>{{ field.name }}</p>

      <div class="form-field__header-actions">
        <v-btn :disabled="first" icon small @click="move('up')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn :disabled="last" icon small @click="move('down')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
        <v-btn icon small color="red" @click="remove">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="form-field__content" @click="openConfigurator">
      <form-field-input v-if="field.type === 'input-field'" :config="field.config" />
      <form-field-textarea v-if="field.type === 'textarea'" :config="field.config" />
    </div>
  </div>
</template>

<script>
  // Components
  import FormFieldInput from '../form-field-input';
  import FormFieldTextarea from '../form-field-textarea';

  export default {
    name: 'FormField',
    components: {
      FormFieldInput,
      FormFieldTextarea
    },
    props: {
      field: {
        type: Object,
        required: true
      },
      first: {
        type: Boolean,
        default: false
      },
      last: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      openConfigurator() {
        this.$emit('configure');
      },
      move(direction) {
        this.$emit('move', direction);
      },
      remove() {
        this.$emit('remove');
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
