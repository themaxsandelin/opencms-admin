<template>
  <v-navigation-drawer permanent fixed app :clipped="true">
    <v-list>
      <v-subheader>Sites</v-subheader>
      <v-list-group
        v-for="(site, i) in sites"
        :key="i"
        :value="$route.path.includes(`/s/${site.key}`)"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ site.name }}</v-list-item-title>
        </template>

        <v-list-item
          :link="true"
          :to="`/s/${site.key}/pages`"
        >
          <v-list-item-icon>
            <v-icon size="20" v-text="`mdi-file-document-multiple`"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="`Pages`"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-list>
      <v-subheader>Content blocks</v-subheader>

      <v-list-group :value="$route.path.includes('/qa')">
        <template v-slot:activator>
          <v-list-item-title>Questions and answers</v-list-item-title>
        </template>

        <v-list-item :link="true" to="/qa/categories">
          <v-list-item-title>Categories</v-list-item-title>
        </v-list-item>

        <v-list-item :link="true" to="/qa/questions">
          <v-list-item-title>Questions</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'NavigationDrawer',
    data() {
      return {
        sites: []
      };
    },
    async fetch() {
      this.sites = await this.$api('/sites');
    },
    methods: {
      clickSite(site) {
        console.log(site);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './style';
</style>
