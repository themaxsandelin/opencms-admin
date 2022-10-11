<template>
  <div>
    <h1>Sites</h1>

    <v-btn color="primary" dark @click="showSiteForm">Create new</v-btn>

    <site-form :visible="siteFormVisible" @hide="hideSiteForm" @created="siteCreatedCallback" />

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading sites... Please wait"
      :headers="headers"
      :items="sites"
      @click:row="siteRowClick"
    >
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // Components
  import SiteForm from '@/components/organisms/site-form';

  export default {
    name: 'SitesPage',
    components: {
      SiteForm
    },
    data() {
      return {
        sites: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'Key',
            value: 'key'
          },
          {
            text: 'Updated',
            value: 'updatedAt'
          },
          {
            text: 'Created',
            value: 'createdAt'
          }
        ],
        siteFormVisible: false
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/sites');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }
      this.$set(this.$data, 'sites', data);
    },
    methods: {
      siteRowClick(site) {
        this.$router.push(`/sites/${site.id}/pages`);
      },
      showSiteForm() {
        this.siteFormVisible = true;
      },
      hideSiteForm() {
        this.siteFormVisible = false;
      },
      siteCreatedCallback() {
        this.$fetch();
      }
    }
  };
</script>
