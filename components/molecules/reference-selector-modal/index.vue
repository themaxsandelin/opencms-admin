<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hide" @keydown.esc="hide">
    <v-card>
      <v-card-title>
        <span class="text-h5">Select a {{ type }}</span>
      </v-card-title>
      <v-card-text>
        <select-reference :selected="selectedItems" :type="type" :content-block="contentBlock" :multiple="multiple" @selection="selection" @deselection="deselection" @toggle-select-all="toggleSelectAll" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="hide">Close</v-btn>
        <v-btn color="primary" :disabled="selectedItems.length === 0" @click="select">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import SelectReference from '@/components/molecules/select-reference';

  export default {
    name: 'ReferenceSelectorModal',
    components: {
      SelectReference
    },
    props: {
      type: {
        type: String,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      },
      selected: {
        type: Array,
        default: () => []
      },
      contentBlock: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedItems: this.selected ? this.selected : []
      };
    },
    watch: {
      selected() {
        this.$set(this.$data, 'selectedItems', this.selected ? this.selected : []);
      }
    },
    methods: {
      hide() {
        this.$emit('hide');
      },
      select() {
        this.$emit('select', this.selectedItems);
      },
      selection(data) {
        const selections = [...this.selectedItems];
        selections.push(data);
        this.$set(this.$data, 'selectedItems', selections);
      },
      deselection(data) {
        const index = this.selectedItems.findIndex(item => item.id === data.id);
        if (index > -1) {
          const selections = [...this.selectedItems];
          selections.splice(index, 1);
          this.$set(this.$data, 'selectedItems', selections);
        }
      },
      toggleSelectAll({ items, value }) {
        if (value) {
          this.$set(this.$data, 'selectedItems', items);
        } else {
          this.$set(this.$data, 'selectedItems', []);
        }
      }
    }
  };
</script>
