<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog" @keydown.esc="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Select a field</span>
      </v-card-title>

      <v-card-text>
        <field-selection-list :selected="selectedField" @selected="selection" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn color="primary" :disabled="!selectedField" @click="submitSelection">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import FieldSelectionList from './components/field-selection-list';

  export default {
    name: 'FormFieldSelector',
    components: {
      FieldSelectionList,
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedField: null
      };
    },
    methods: {
      hideDialog() {
        this.$set(this.$data, 'selectedField', null);
        this.$emit('hide');
      },
      selection(field) {
        this.$set(this.$data, 'selectedField', field);
      },
      submitSelection() {
        this.$emit('selection', this.selectedField);
        this.$set(this.$data, 'selectedField', null);
        this.hideDialog();
      }
    }
  };
</script>
