<template>
  <div>
    <h1>{{ page.title }}</h1>
    <h4>Layouts</h4>

    <v-row>
      <v-col cols="3">
        <v-select
          :items="layouts"
          label="Select a layout.."
          :value="selectedLayout"
          @change="layoutSelectionChange"
        />
      </v-col>
      <v-col cols="3">
        <v-btn color="primary" dark @click="showLayoutForm">Create new layout</v-btn>
      </v-col>
    </v-row>

    <page-layout-form
      :visible="layoutFormVisible"
      @hide="hideLayoutForm"
      @created="layoutCreated"
    />

    <page-layout-editor
      v-if="layout"
      :page="page"
      :layout="layout"
    />
  </div>
</template>

<script>
// Components
import PageLayoutForm from '@/components/organisms/page-layout-form';
import PageLayoutEditor from '@/components/organisms/page-layout-editor';

export default {
  name: 'SitePage',
  components: {
    PageLayoutForm,
    PageLayoutEditor
  },
  data() {
    return {
      page: {},
      layout: null,
      layoutFormVisible: false
    };
  },
  async fetch() {
    if (!this.page.id) {
      await this.updatePage();
    }
    if (!this.layout && this.$route.query.layout) {
      await this.updateLayout();
    }
  },
  computed: {
    layouts() {
      return this.page.layouts ? this.page.layouts.map(layout => ({
        value: layout.id,
        text: layout.name
      })) : [];
    },
    selectedLayout() {
      return this.$route.query.layout || '';
    }
  },
  watch: {
    selectedLayout() {
      this.updateLayout();
    }
  },
  methods: {
    showLayoutForm() {
      this.layoutFormVisible = true;
    },
    hideLayoutForm() {
      this.layoutFormVisible = false;
    },
    layoutCreated() {
      this.$fetch();
    },
    layoutSelectionChange(layoutId) {
      this.$router.push({ query: { layout: layoutId } });
    },
    async updatePage() {
      const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}/pages/${this.$route.params.pageId}`);
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { message: 'Failed to load sites.', type: 'error' });
      }
      this.$set(this.$data, 'page', data);
    },
    async updateLayout() {
      const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}/pages/${this.$route.params.pageId}/layouts/${this.$route.query.layout}`);
      if (error) {
        console.error('Failed to fetch page layout', error);
        return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load layout.' });
      }
      this.$set(this.$data, 'layout', data);
    },
  }
}
</script>
