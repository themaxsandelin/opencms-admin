<template>
  <div>
    <template v-if="$fetchState.pending">
      Loading site..
    </template>
    <template v-else-if="$fetchState.error">
      Failed to load site. :(
    </template>
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
      site: {}
    };
  },
  async fetch() {
    this.site = await this.$api(`/sites/${this.$route.params.siteKey}`);
  },
};
</script>
