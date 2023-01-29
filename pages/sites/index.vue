<template>
  <div>
    <h1>Sites</h1>

    <v-btn color="primary" dark @click="showSiteForm">Create new</v-btn>

    <site-form :visible="siteFormVisible" @hide="hideSiteForm" @created="siteCreatedCallback" />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table :loading="$fetchState.pending" loading-text="Loading sites... Please wait" :headers="headers" :items="sites" :search="search" @click:row="siteRowClick">
        <template #item.name="{ item }">
          <span @click.stop>
            <router-link :to="`/sites/${item.id}/pages`">
              {{ item.name }}
            </router-link>
          </span>
        </template>
        <template #item.updatedAt="{ item }">
          <timestamp-at :timestamp="item.updatedAt" :user="item.updatedBy" />
        </template>

        <template #item.createdAt="{ item }">
          <timestamp-at :timestamp="item.createdAt" :user="item.createdBy" />
        </template>
      </v-data-table>
    </v-card>
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
        search: '',
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
