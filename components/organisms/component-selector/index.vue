<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Select a component</span>
      </v-card-title>

      <v-card-text>
        <component-selection-list :selected="selectedComponent" @selected="selection" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn color="primary" :disabled="!selectedComponent" @click="submitSelection">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import ComponentSelectionList from './components/component-selection-list';

  export default {
    name: 'ComponentSelector',
    components: {
      ComponentSelectionList
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedComponent: null
      };
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      selection(component) {
        this.$set(this.$data, 'selectedComponent', component);
      },
      submitSelection() {
        this.$emit('selection', this.selectedComponent);
        this.$set(this.$data, 'selectedComponent', null);
        this.hideDialog();
      }
    }
  }
</script>
