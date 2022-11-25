<template>
  <div>
    <h1>Forms</h1>
    <router-link to="/forms/new">
      <v-btn color="primary" dark>Create new</v-btn>
    </router-link>

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading forms... Please wait"
      :headers="headers"
      :items="forms"
      @click:row="formRowClick"
    >
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.updatedBy="{ item }">
        <span>{{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdBy="{ item }">
        <span>{{ item.createdBy.firstName }} {{ item.createdBy.lastName }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: 'FormsPage',
    data() {
      return {
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'Last updated',
            value: 'updatedAt'
          },
          {
            text: 'Updated by',
            value: 'updatedBy'
          },
          {
            text: 'Created',
            value: 'createdAt'
          },
          {
            text: 'Created by',
            value: 'createdBy'
          }
        ],
        forms: []
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/forms');
      if (error) {
        console.error('Failed to load forms', forms);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }

      this.$set(this.$data, 'forms', data);
    },
    methods: {
      formRowClick(form) {
        this.$router.push({ path: `${this.$route.path}/${form.id}` });
      }
    }
  };
</script>
