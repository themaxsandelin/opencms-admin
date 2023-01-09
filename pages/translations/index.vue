<template>
  <div>
    <h1>Translations</h1>

    <v-btn color="primary" dark @click="showForm">Add new</v-btn>

    <translation-form
      :visible="formVisible"
      :translation="editingTranslation"
      @hide="hideForm"
      @created="onTranslationFormEvent"
      @updated="onTranslationFormEvent"
      @deleted="onTranslationFormEvent"
    />

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
        :items="translations"
        :items-per-page="20"
        :loading="$fetchState.pending"
        :custom-sort="sortTranslations"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        loading-text="Loading translations..."
        :expanded.sync="expanded"
        :single-expand="true"
        hide-default-footer
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            {{ Object.keys(item.value.values).map(code => `${code}: ${item.value.values[code]}`).join(' | ') }}
          </td>
        </template>
        <template v-slot:item.value="{ item }">
          <span>{{ Object.keys(item.value.values).join(', ') }}</span>
        </template>
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
        <template v-slot:item.actions="{ item }">
          <v-btn small outlined @click="editQuestion($event, item)">...</v-btn>
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
  import TranslationForm from '@/components/organisms/translation-form';
  import TablePagination from '@/components/molecules/table-pagination';

  export default {
    name: 'TranslationsPage',
    components: {
      TranslationForm,
      TablePagination,
    },
    data() {
      return {
        editingTranslation: null,
        formVisible: false,
        search: '',
        searchTimeout: null,
        sortBy: 'createdAt',
        sortDesc: true,
        total: 0,
        page: 1,
        pagination: null,
        translations: [],
        headers: [
          {
            text: 'Key',
            value: 'key',
            align: 'start'
          },
          {
            text: 'Locales',
            value: 'value',
            sortable: false,
          },
          {
            text: 'Last updated',
            value: 'updatedAt'
          },
          {
            text: 'Updated by',
            value: 'updatedBy',
            sortable: false
          },
          {
            text: 'Created',
            value: 'createdAt'
          },
          {
            text: 'Created by',
            value: 'createdBy',
            sortable: false
          },
          {
            text: '',
            value: 'actions',
            sortable: false
          }
        ],
        expanded: []
      };
    },
    async fetch() {
      let uri = `/translations?page=${this.page}&sortBy=${this.sortBy}&sort=${this.sortDesc ? 'desc' : 'asc'}`;
      if (this.search) {
        uri += `&search=${this.search}`;
      }
      const { data, pagination, error } = await this.$api(uri);
      if (error) {
        console.error('Failed to fetch translations.', error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }

      this.$set(this.$data, 'translations', data);
      this.$set(this.$data, 'pagination', pagination);
    },
    methods: {
      showForm() {
        this.$set(this.$data, 'formVisible', true);
      },
      hideForm() {
        this.$set(this.$data, 'formVisible', false);
      },
      onTranslationFormEvent() {
        this.$set(this.$data, 'editingTranslation', null);
        this.hideForm();
        this.$fetch();
      },
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
      sortTranslations(items, sortBy, sortDesc) {
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
      },
      editQuestion(event, item) {
        this.$set(this.$data, 'editingTranslation', item);
        this.showForm();
      }
    }
  };
</script>
