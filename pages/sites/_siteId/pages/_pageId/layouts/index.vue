<template>
  <div>
    <page-tabs />

    <h1>Layouts</h1>

    <v-row>
      <v-col cols="3">
        <v-select
          :items="layoutList"
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
  import PageTabs from '@/components/molecules/page-tabs';
  import PageLayoutForm from '@/components/organisms/page-layout-form';
  import PageLayoutEditor from '@/components/organisms/page-layout-editor';

  export default {
    name: 'PageLayouts',
    components: {
      PageTabs,
      PageLayoutForm,
      PageLayoutEditor
    },
    data() {
      return {
        page: {},
        layouts: [],
        layout: null,
        layoutFormVisible: false
      };
    },
    async fetch() {
      if (!this.page.id) {
        await this.updatePage();
      }
      if (!this.layouts.length) {
        await this.updateLayouts();
      }
      if (!this.layout && this.$route.query.layoutId) {
        await this.updateLayout();
      }
    },
    computed: {
      layoutList() {
        return this.layouts ? this.layouts.map(layout => ({
          value: layout.id,
          text: layout.name
        })) : [];
      },
      selectedLayout() {
        return this.$route.query.layoutId || '';
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
        this.updatePage();
        this.updateLayouts();
      },
      layoutSelectionChange(layoutId) {
        this.$router.push({ query: { layoutId } });
      },
      async updatePage() {
        const { siteId, pageId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}`);
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { message: 'Failed to load sites.', type: 'error' });
        }
        this.$set(this.$data, 'page', data);
      },
      async updateLayouts() {
        const { siteId, pageId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts`);
        if (error) {
          console.error('Failed to fetch page layouts', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load layouts.' });
        }
        this.$set(this.$data, 'layouts', data);
      },
      async updateLayout() {
        const { layoutId } = this.$route.query;
        const { siteId, pageId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts/${layoutId}`);
        if (error) {
          console.error('Failed to fetch page layout', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load layout.' });
        }
        this.$set(this.$data, 'layout', data);
      }
    }
  };
</script>
