<template>
  <v-tabs>
    <v-tab
      v-for="(item, i) in tabs"
      :key="i"
      :link="true"
      :exact="true"
      :to="item.url"
    >
      {{ item.text }}
    </v-tab>
  </v-tabs>
</template>

<script>
  export default {
    name: 'PageTabs',
    computed: {
      tabs() {
        return [
          {
            text: 'Overview',
            url: this.pageUrl
          },
          {
            text: 'Instances',
            url: this.instancesUrl
          },
          {
            text: 'Layouts',
            url: this.layoutsUrl
          }
        ];
      },
      pageUrl() {
        return `/sites/${this.$route.params.siteId}/pages/${this.$route.params.pageId}`;
      },
      instancesUrl() {
        return `${this.pageUrl}/instances`;
      },
      layoutsUrl() {
        return `${this.pageUrl}/layouts`;
      }
    }
  };
</script>
