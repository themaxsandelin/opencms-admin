<template>
  <div>
    <v-text-field v-model="searchTerm" label="Search" outlined clearable @input="searchInput" />
    <v-data-table
      :value="selected"
      :headers="headers"
      :items="pages"
      :single-select="true"
      :loading="fetching"
      item-key="id"
      show-select
      @item-selected="pageSelected"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectPage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: '',
      searchTimeout: null,
      pages: [],
      headers: [
        {
          text: 'Title',
          value: 'title',
          align: 'start'
        },
        {
          text: 'Slug',
          value: 'slug',
        },
        {
          text: 'Path',
          value: 'path'
        }
      ]
    };
  },
  async fetch() {
    this.fetching = true;
    this.pages = await this.$api(`/sites/${this.$route.params.siteKey}/pages?search=${this.searchTerm}`);
    this.fetching = false;
  },
  fetchKey() {
    return `pages-${this.searchTerm}`;
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
    pageSelected({ value, item }) {
      if (value) {
        this.$emit('selection', item);
      } else {
        this.$emit('deselection', item);
      }
    }
  }
};
</script>
