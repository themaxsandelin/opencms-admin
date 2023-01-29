<template>
  <div>
    <h1>Publishing environments</h1>

    <v-btn color="primary" dark @click="showEnvironmentForm">Create new</v-btn>

    <environment-form :visible="environmentFormVisible" @hide="hideEnvironmentForm" @created="createdCallback" />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="$fetchState.pending"
        loading-text="Loading environments... Please wait"
        :headers="headers"
        :items="environments"
        :search="search"
        @click:row="environmentRowClick"
      >
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
  import EnvironmentForm from '@/components/organisms/environment-form';

  export default {
    name: 'PublishingEnvironments',
    components: {
      EnvironmentForm
    },
    data() {
      return {
        search: '',
        environments: [],
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
            text: 'Last updated',
            value: 'updatedAt'
          },
          {
            text: 'Created',
            value: 'updatedAt'
          }
        ],
        environmentFormVisible: false
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/publishing-environments');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }
      this.$set(this.$data, 'environments', data);
    },
    methods: {
      environmentRowClick() {},
      showEnvironmentForm() {
        this.environmentFormVisible = true;
      },
      hideEnvironmentForm() {
        this.environmentFormVisible = false;
      },
      createdCallback() {
        this.$fetch();
      }
    }
  };
</script>
