<template>
  <div>
    <h1>Publishing environments</h1>

    <v-btn color="primary" dark @click="showEnvironmentForm">Create new</v-btn>

    <environment-form :visible="environmentFormVisible" @hide="hideEnvironmentForm" @created="createdCallback" />

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading environments... Please wait"
      :headers="headers"
      :items="environments"
      @click:row="environmentRowClick"
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
  import EnvironmentForm from '@/components/organisms/environment-form';

  export default {
    name: 'PublishingEnvironments',
    components: {
      EnvironmentForm
    },
    data() {
      return {
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
