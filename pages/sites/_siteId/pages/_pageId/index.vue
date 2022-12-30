<template>
  <div>
    <h1>{{ page.name || '&nbsp;' }}</h1>
    <page-tabs />
  </div>
</template>

<script>
  // Components
  import PageTabs from '@/components/molecules/page-tabs';

  export default {
    name: 'SitePage',
    components: {
      PageTabs
    },
    data() {
      return {
        page: {}
      };
    },
    async fetch() {
      if (!this.page.id) {
        await this.updatePage();
      }
    },
    methods: {
      async updatePage() {
        const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}/pages/${this.$route.params.pageId}`);
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', {
            message: 'Failed to load pages.',
            type: 'error'
          });
        }
        this.$set(this.$data, 'page', data);
      }
    }
  };
</script>
