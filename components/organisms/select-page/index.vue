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
        fetching: false,
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
      const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}/pages?search=${this.searchTerm}`);
      this.$set(this.$data, 'fetching', false);
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { message: 'Failed to load pages.', type: 'error' });
      }

      this.$set(this.$data, 'pages', data);
    },
    fetchKey() {
      return `pages-${this.searchTerm}`;
    },
    methods: {
      emitClose() {
        this.$emit('close');
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
