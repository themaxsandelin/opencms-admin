<template>
  <div>
    <h1>Pages</h1>
    <v-btn color="primary" dark @click="showPageForm">Create new</v-btn>
    <page-form
      :visible="pageFormVisible"
      :page="editingPage"
      @hide="hidePageForm"
      @created="pageUpdateCallback"
      @updated="pageUpdateCallback"
      @deleted="pageUpdateCallback"
    />

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading pages... Please wait"
      :headers="headers"
      :items="pages"
      @click:row="pageRowClick"
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
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editPage($event, item)">
          Edit
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// Components
import PageForm from '@/components/organisms/page-form';

export default {
  name: 'SitePages',
  components: {
    PageForm
  },
  data() {
    return {
      pages: [],
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Updated',
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
        },
        {
          text: '',
          value: 'actions'
        }
      ],
      pageFormVisible: false,
      editingPage: null
    };
  },
  async fetch() {
    const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}/pages`);
    if (error) {
      console.error(error);
      return this.$store.commit('alert/set', { message: 'Failed to load pages.', type: 'error' });
    }

    this.$set(this.$data, 'pages', data);
  },
  methods: {
    showPageForm() {
      this.pageFormVisible = true;
    },
    hidePageForm() {
      if (this.editingPage) {
        this.$set(this.$data, 'editingPage', null);
      }
      this.pageFormVisible = false;
    },
    pageUpdateCallback() {
      this.$fetch();
    },
    pageRowClick(page) {
      this.$router.push({ path: `${this.$route.path}/${page.id}` });
    },
    editPage(event, page) {
      event.stopPropagation();
      this.$set(this.$data, 'editingPage', page);
      this.showPageForm();
    }
  }
};
</script>
