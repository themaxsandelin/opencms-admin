<template>
  <div>
    <h1>Pages</h1>
    <v-btn color="primary" dark @click="showPageForm">
      Create new
    </v-btn>
    <page-form
      :visible="pageFormVisible"
      @hide="hidePageForm"
      @created="pageCreatedCallback"
    />
    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading pages... Please wait"
      :headers="tableHeaders"
      :items="pages"
      @click:row="pageRowClick"
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
import PageForm from '@/components/organisms/page-form';

export default {
  name: 'SitePages',
  components: {
    PageForm
  },
  data() {
    return {
      pages: [],
      tableHeaders: [
        {
          text: 'Title',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Slug',
          value: 'slug'
        },
        {
          text: 'Path',
          value: 'path'
        },
        {
          text: 'Updated',
          value: 'updatedAt'
        },
        {
          text: 'Created',
          value: 'createdAt'
        }
      ],
      pageFormVisible: false
    };
  },
  async fetch() {
    const pages = await this.$api(`/sites/${this.$route.params.siteKey}/pages`);
    if (pages.statusCode) {
      return console.error(pages);
    }

    this.pages = pages;
  },
  methods: {
    showPageForm() {
      this.pageFormVisible = true;
    },
    hidePageForm() {
      this.pageFormVisible = false;
    },
    pageCreatedCallback() {
      this.$fetch();
    },
    pageRowClick(page) {
      this.$router.push({ path: `${this.$route.path}/${page.id}` });
    }
  }
};
</script>
