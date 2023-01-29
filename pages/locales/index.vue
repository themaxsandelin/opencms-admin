<template>
  <div>
    <h1>Locales</h1>

    <v-btn color="primary" dark @click="showLocaleForm">Add new</v-btn>

    <locale-form :visible="localeFormVisible" @hide="hideLocaleForm" @created="newLocaleCreated" />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table :loading="$fetchState.pending" loading-text="Loading locales... Please wait" :headers="headers" :items="locales" :search="search" @click:row="localeRowClick">
        <template #item.code="{ item }"> <locale-icon :locale="item.code" /> {{ item.code }} </template>

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
  import LocaleForm from '../../components/organisms/locale-form';

  export default {
    name: 'LocalesPage',
    components: {
      LocaleForm
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
            text: 'Created',
            value: 'createdAt'
          }
        ]
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
    }
  };
</script>
