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
    name: 'SelectQuestionCategory',
    props: {
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
      this.$set(this.$data, 'fetching', true);
      const categories = await this.$api(`/content-blocks/?search=${this.searchTerm}&type=question-category`);
      this.$set(this.$data, 'fetching', false);
      if (categories.statusCode) {
        return console.error('Failed to find question categories', categories);
      }

      this.$set(this.$data, 'categories', categories);
      this.setSelectedCategories();
    },
    fetchKey() {
      return `question-categories-${this.searchTerm}`;
    },
    watch: {
      selected() {
        this.$emit('update', this.selected);
      },
      selectedIds() {
        this.setSelectedCategories();
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
      },
      setSelectedCategories() {
        this.$set(this.$data, 'selected', this.selectedIds.length ? this.categories.filter(category => this.selectedIds.includes(category.id)) : []);
      }
    }
  };
  </script>
