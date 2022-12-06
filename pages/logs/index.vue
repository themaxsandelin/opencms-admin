<template>
  <div>
    <h1>Activity logs</h1>

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="logs"
        :page.sync="page"
        :items-per-page="10"
        hide-default-footer
        @page-count="pageCount = $event"
      >
        <template v-slot:item.createdAt="{ item }">
          <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
        </template>
        <template v-slot:item.createdBy="{ item }">
          <span>{{ item.createdBy.firstName }} {{ item.createdBy.lastName }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'ActivityLogsPage',
    data() {
      return {
        search: '',
        logs: [],
        headers: [
          {
            text: 'Action',
            value: 'action',
            align: 'start'
          },
          {
            text: 'Resource type',
            value: 'resourceType'
          },
          {
            text: 'Resource',
            value: 'resourceId'
          },
          {
            text: 'Detail text (optional)',
            value: 'detailText'
          },
          {
            text: 'Created',
            value: 'createdAt'
          },
          {
            text: 'Done by',
            value: 'createdBy'
          }
        ],
        page: 1,
        pageCount: 0,
      };
    },
    async fetch() {
      const { data, error } = await this.$api(`/activity-logs?page=${this.page}`);
      if (error) {
        console.error('Failed to load activity logs', error);
        return this.$store.commit('alert/set', { type: 'error', error });
      }

      this.$set(this.$data, 'logs', data);
    },
  };
</script>
