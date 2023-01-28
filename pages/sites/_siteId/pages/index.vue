<template>
  <div>
    <h1>Pages</h1>
    <v-btn color="primary" dark @click="showPageForm">Create new</v-btn>
    <page-form :visible="pageFormVisible" :page="editingPage" @hide="hidePageForm" @created="pageUpdateCallback" @updated="pageUpdateCallback" />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table :loading="$fetchState.pending" loading-text="Loading pages... Please wait" :headers="headers" :items="pages" :search="search" @click:row="pageRowClick">
        <template #item.name="{ item }">
          <router-link :to="pageLink(item)">
            {{ breadcrumb(item) }}
          </router-link>
        </template>

        <template #item.instances="{ item }">
          <router-link :to="instanceLink(item, { id: '' })">
            <v-icon>mdi-view-list</v-icon>
          </router-link>
          <router-link v-for="instance in item.instances" :key="instance.id" :to="instanceLink(item, instance)">
            <locale-icon :locale="instance.localeCode" :title="instance.title" />
          </router-link>
        </template>
        <template #item.layouts="{ item }">
          <span v-for="layout in item.layouts" :key="layout.id">
            <router-link :to="layoutLink(item, layout)">{{ layout.name }}</router-link>
            &nbsp;
          </span>
        </template>
        <template #item.updatedAt="{ item }">
          <router-link :to="pageLink(item)">{{ new Date(item.updatedAt).toLocaleString() }} by {{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }}</router-link>
        </template>
        <template #item.actions="{ item }">
          <v-btn small outlined @click="editPage($event, item)">...</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
// Components
  import PageForm from '@/components/organisms/page-form';
  import LocaleIcon from '@/components/molecules/locale-icon';

  export default {
    name: 'SitePages',
    components: {
      PageForm,
      LocaleIcon
    },
    data() {
      return {
        search: '',
        pages: [],
        headers: [
          {
            text: 'Name',
            align: 'start',
            value: 'name'
          },
          {
            text: 'Instances',
            value: 'instances'
          },
          {
            text: 'Layouts',
            value: 'layouts'
          },
          {
            text: 'Updated',
            value: 'updatedAt'
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
      breadcrumb(page) {
        const getParent = (page) => {
          if (!page.parent) {
            return page.name;
          }
          return getParent(page.parent) + ' / ' + page.name;
        };
        return getParent(page);
      },
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
      editPage(event, page) {
        event.stopPropagation();
        this.$set(this.$data, 'editingPage', page);
        this.showPageForm();
      },
      pageLink(page) {
        return `pages/${page.id}`;
      },
      instanceLink(page, instance) {
        return `pages/${page.id}/instances/${instance.id}`;
      },
      layoutLink(page, layout) {
        return `pages/${page.id}/layouts?layoutId=${layout.id}`;
      },
      pageRowClick(page) {
        this.$router.push({ path: this.pageLink(page) });
      }
    }
  };
</script>
