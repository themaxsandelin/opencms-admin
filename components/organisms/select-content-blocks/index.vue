<template>
  <div>
    <v-text-field v-model="searchTerm" label="Search" outlined clearable @input="searchInput" />
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :loading="fetching"
      item-key="id"
      show-select
    />
  </div>
</template>

<script>
  const contentBlockTypes = ['question', 'question-category'];

  export default {
    name: 'SelectContentBlocks',
    props: {
      type: {
        type: String,
        validator: (value) => contentBlockTypes.includes(value),
        required: true
      },
      selectedIds: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      return {
        fetching: false,
        searchTerm: '',
        searchTimeout: null,
        items: [],
        selected: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          }
        ]
      };
    },
    async fetch() {
      this.$set(this.$data, 'fetching', true);
      const { data, error } = await this.$api(`/content-blocks/?search=${this.searchTerm}&type=${this.type}`);
      this.$set(this.$data, 'fetching', false);
      if (error) {
        console.error(`Failed to find content block by type ${this.type}`, error);
        return this.$store.commit('alert/set', { type: 'error', message: `Failed to fetch content blocks by type ${this.type}.` });
      }

      this.$set(this.$data, 'items', data);
      this.setSelectedItems();
    },
    watch: {
      selected() {
        this.$emit('update', this.selected);
      },
      selectedIds() {
        this.setSelectedItems();
      }
    },
    methods: {
      emitClose() {
        this.$emit('close');
      },
      handleKeydown(e) {
        if (e.key === 'Escape') {
          this.emitClose();
        }
      },
      searchTimeoutCallback() {
        this.$fetch();
      },
      searchInput() {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(this.searchTimeoutCallback, 500);
      },
      setSelectedItems() {
        this.$set(this.$data, 'selected', this.selectedIds.length ? this.items.filter(item => this.selectedIds.includes(item.id)) : []);
      }
    }
  };
</script>
