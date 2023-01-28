<template>
  <div>
    <h1>Forms</h1>
    <router-link to="/forms/new">
      <v-btn color="primary" dark>Create new</v-btn>
    </router-link>

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table :loading="$fetchState.pending" loading-text="Loading forms... Please wait" :headers="headers" :items="forms" :search="search" @click:row="formRowClick">
        <template #item.name="{ item }">
          <router-link :to="formLink(item)">
            <span> {{ item.name }} </span>
          </router-link>
        </template>
        <template #item.view="{ item }">
          <router-link :to="formSubmissionLink(item)">
            <span> View Submissions </span>
          </router-link>
        </template>
        <template #item.edit="{ item }">
          <router-link :to="formEditLink(item)">
            <span>Edit Fields </span>
          </router-link>
        </template>
        <template #item.updatedAt="{ item }">
          <router-link :to="formLink(item)">
            <span> {{ new Date(item.updatedAt).toLocaleString() }} by {{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }} </span>
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'FormsPage',
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'View Submissions',
            value: 'view'
          },
          {
            text: 'Edit Fields',
            value: 'edit'
          },
          {
            text: 'Updated',
            value: 'updatedAt'
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
        this.$router.push({ path: this.formLink(form) });
      },
      formLink(form) {
        return `forms/${form.id}`;
      },
      formEditLink(form) {
        return `forms/${form.id}/configure`;
      },
      formSubmissionLink(form) {
        return `forms/${form.id}/submissions`;
      }
    }
  };
</script>
