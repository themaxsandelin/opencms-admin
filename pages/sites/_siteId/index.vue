<template>
  <div>
    <template v-if="$fetchState.pending"> Loading site.. </template>
    <template v-else-if="$fetchState.error"> Failed to load site. :( </template>
    <template v-else>
      <h1>{{ site.name }}</h1>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SitePage',
    data() {
      return {
        site: null
      };
    },
    async fetch() {
      const { data, error } = await this.$api(`/sites/${this.$route.params.siteId}`);
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { message: 'Failed to load the site.', type: 'error' });
      }

      this.$set(this.$data, 'site', data);
    }
  };
</script>
