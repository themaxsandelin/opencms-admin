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
      this.fetching = true;
      const sites = await this.$api('/sites');
      this.fetching = false;
      if (sites.statusCode) {
        console.error(sites);
        return this.$store.commit('alert/set', { message: sites.error || `Request failed. Status code ${sites.statusCode}.`, type: 'error' });
      }

      this.sites = sites;
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
