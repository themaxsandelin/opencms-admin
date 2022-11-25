<template>
  <v-data-table
    :value="selected"
    :headers="headers"
    :items="sites"
    :loading="fetching"
    item-key="id"
    show-select
    @item-selected="siteSelected"
    @toggle-select-all="selectAllToggled"
  />
</template>

<script>
  export default {
    name: 'SelectSite',
    props: {
      selected: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        fetching: false,
        searchTerm: '',
        sites: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'Key',
            value: 'key',
          }
        ]
      }
    },
    async fetch() {
      this.$set(this.$data, 'fetching', true);
      const { data, error } = await this.$api('/sites');
      this.$set(this.$data, 'fetching', false);
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { message: 'Failed to load sites.', type: 'error' });
      }

      this.$set(this.$data, 'sites', data);
    },
    methods: {
      siteSelected(data) {
        this.$emit('selection-change', data);
      },
      selectAllToggled(data) {
        this.$emit('toggle-all-selected', data);
      }
    }
  };
</script>
