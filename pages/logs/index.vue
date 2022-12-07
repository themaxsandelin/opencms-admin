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
          @input="searchInput"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="logs"
        :items-per-page="20"
        :loading="$fetchState.pending"
        :custom-sort="sortLogs"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        loading-text="Loading activity logs..."
        hide-default-footer
      >
        <template v-slot:item.createdAt="{ item }">
          <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
        </template>
        <template v-slot:item.createdBy="{ item }">
          <span>{{ item.createdBy.firstName }} {{ item.createdBy.lastName }}</span>
        </template>
      </v-data-table>

      <table-pagination
        v-if="pagination"
        v-bind="pagination"
        @page="toPage"
      />
    </v-card>
  </div>
</template>

<script>
  // Components
  import TablePagination from '@/components/molecules/table-pagination';

  export default {
    name: 'ActivityLogsPage',
    components: {
      TablePagination,
    },
    data() {
      return {
        search: '',
        logs: [],
        sortBy: 'createdAt',
        sortDesc: true,
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
            value: 'createdBy',
            sortable: false
          }
        ],
        total: 0,
        page: 1,
        pagination: null,
        searchTimeout: null
      };
    },
    async fetch() {
      let uri = `/activity-logs?page=${this.page}&sortBy=${this.sortBy}&sort=${this.sortDesc ? 'desc' : 'asc'}`;
      if (this.search) {
        uri += `&search=${this.search}`;
      }
      const { data, pagination, error } = await this.$api(uri);
      if (error) {
        console.error('Failed to load activity logs', error);
        return this.$store.commit('alert/set', { type: 'error', error });
      }

      this.$set(this.$data, 'logs', data);
      this.$set(this.$data, 'pagination', pagination);
    },
    methods: {
      performSearch() {
        this.$fetch();
      },
      searchInput() {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
          this.$set(this.$data, 'searchTimeout', null);
        }
        const timeout = setTimeout(this.performSearch, 800);
        this.$set(this.$data, 'searchTimeout', timeout);
      },
      sortLogs(items, sortBy, sortDesc) {
        if (sortBy !== this.sortBy || sortDesc !== this.sortDesc) {
          this.$set(this.$data, 'sortBy', sortBy);
          this.$set(this.$data, 'sortDesc', sortDesc[0]);
          this.$fetch();
        }
        return items;
      },
      toPage(number) {
        this.$set(this.$data, 'page', number);
        this.$fetch();
      }
    }
  };
</script>
