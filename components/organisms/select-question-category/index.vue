<template>
  <div>
    <v-text-field v-model="searchTerm" label="Search" outlined clearable @input="searchInput" />
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="categories"
      :loading="fetching"
      item-key="id"
      show-select
    />
  </div>
</template>

<script>
  export default {
    name: 'SelectPage',
    data() {
      return {
        searchTerm: '',
        searchTimeout: null,
        categories: [],
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
      this.fetching = true;
      const categories = await this.$api(`/content-blocks/?search=${this.searchTerm}&type=question-category`);
      this.fetching = false;
      if (categories.statusCode) {
        return console.error('Failed to find question categories', categories);
      }

      this.categories = categories;
    },
    fetchKey() {
      return `question-categories-${this.searchTerm}`;
    },
    watch: {
      selected() {
        this.$emit('update', this.selected);
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
      searchInput(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(this.searchTimeoutCallback, 500);
      }
    }
  };
  </script>
