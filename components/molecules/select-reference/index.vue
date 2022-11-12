<template>
  <div>
    <v-text-field v-model="searchTerm" label="Search" outlined clearable @input="searchInput" />
    <v-data-table
      :value="selected"
      :headers="headers"
      :items="items"
      :single-select="true"
      :loading="$fetchState.pending"
      item-key="id"
      show-select
      @item-selected="itemSelected"
    />
  </div>
</template>

<script>
  export default {
    name: 'SelectReference',
    props: {
      type: {
        type: String,
        required: true
      },
      selected: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        searchTerm: '',
        items: [],
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
      let uri = '';
      if (this.type === 'page') {
        uri = `/sites/${this.$route.params.siteId}/pages`
      } else if (this.type === 'form') {
        uri = '/forms';
      }

      if (!uri) {
        return console.error(`Could not fetch items due to unknown type ${this.type}`);
      }

      uri += `?search=${this.searchTerm}`;
        const { data, error } = await this.$api(uri);
        if (error) {
          console.error(`Failed to load items of type ${this.type}`, error);
          return this.$store.commit('alert/set', { message: error, type: 'error' });
        }

        this.$set(this.$data, 'items', data);
    },
    methods: {
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
      itemSelected({ value, item }) {
        if (value) {
          this.$emit('selection', item);
        } else {
          this.$emit('deselection', item);
        }
      },
    }
  };
</script>
