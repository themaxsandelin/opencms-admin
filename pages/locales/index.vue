<template>
  <div>
    <h1>Locales</h1>

    <v-btn color="primary" dark @click="showLocaleForm">Add new</v-btn>

    <locale-form :visible="localeFormVisible" @created="newLocaleCreated" />

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
        :loading="$fetchState.pending"
        loading-text="Loading locales... Please wait"
        :headers="headers"
        :items="locales"
        :search="search"
        @click:row="localeRowClick"
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
    </v-card>
  </div>
</template>

<script>
  // Components
  import LocaleForm from '../../components/organisms/locale-form';

  export default {
    name: 'LocalesPage',
    components: {
      LocaleForm,
    },
    data() {
      return {
        search: '',
        localeFormVisible: false,
        locales: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'Code',
            value: 'code'
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
            value: 'updatedAt'
          },
          {
            text: 'Created by',
            value: 'updatedBy'
          }
        ],
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/locales');
      if (error) {
        console.error('Failed to fetch locales.', error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }

      this.$set(this.$data, 'locales', data);
    },
    methods: {
      showLocaleForm() {
        this.$set(this.$data, 'localeFormVisible', true);
      },
      hideLocaleForm() {
        this.$set(this.$data, 'localeFormVisible', false);
      },
      newLocaleCreated() {
        this.hideLocaleForm();
        this.$fetch();
      },
      localeRowClick() {}
    },
  };
</script>
