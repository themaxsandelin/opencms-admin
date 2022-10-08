<template>
  <div>
    <h1>{{ page.title }}</h1>
    <h4>Layouts</h4>
    <v-btn color="primary" dark @click="showLayoutForm">Create new</v-btn>
    <layout-form
      :visible="layoutFormVisible"
      @hide="hideLayoutForm"
      @created="layoutCreated"
    />

    <layout-grid :layouts="page.layouts" :loading="loadingPage" />
  </div>
</template>

<script>
// Components
import LayoutGrid from '@/components/molecules/layout-grid';
import LayoutForm from '@/components/organisms/layout-form';

export default {
  name: 'SitePage',
  components: {
    LayoutGrid,
    LayoutForm
  },
  data() {
    return {
      page: {},
      loadingPage: false,
      layoutFormVisible: false
    };
  },
  async fetch() {
    this.$set(this.$data, 'loadingPage', true);
    const { data, error } = await this.$api(`/sites/${this.$route.params.siteKey}/pages/${this.$route.params.pageId}`);
    this.$set(this.$data, 'loadingPage', false);
    if (error) {
      console.error(error);
      return this.$store.commit('alert/set', { message: 'Failed to load sites.', type: 'error' });
    }

    this.$set(this.$data, 'page', data);
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
    }
  }
}
</script>
