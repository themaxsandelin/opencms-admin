<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hide" @keydown.esc="hide">
    <v-card>
      <v-card-title>
        <span class="text-h5">Select a page</span>
      </v-card-title>
      <v-card-text>
        <select-page :selected="selectedPages" @selection="selection" @deselection="deselection" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="hide">Close</v-btn>
        <v-btn color="primary" :disabled="selectedPages.length === 0" @click="select">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import SelectPage from '@/components/organisms/select-page';

  export default {
    name: 'PageSelectorModal',
    components: {
      SelectPage
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      selected: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        selectedPages: this.selected ? [this.selected] : []
      };
    },
    watch: {
      selected() {
        this.$set(this.$data, 'selectedPages', this.selected ? [this.selected] : []);
      }
    },
    methods: {
      hide() {
        this.$emit('hide');
      },
      select() {
        this.$emit('select', this.selectedPages);
      },
      selection(data) {
        const pages = [...this.selectedPages];
        pages.push(data);
        this.$set(this.$data, 'selectedPages', pages);
      },
      deselection(data) {
        const index = this.selectedPages.findIndex(page => page.id === data.id);
        if (index > -1) {
          const pages = [...this.selectedPages];
          pages.splice(index, 1);
          this.$set(this.$data, 'selectedPages', pages);
        }
      }
    }
  };
</script>
