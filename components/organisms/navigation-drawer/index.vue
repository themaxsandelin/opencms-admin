<template>
  <v-navigation-drawer permanent fixed app :clipped="true">
    <v-subheader>Pages</v-subheader>
    <v-list>
      <v-list-item v-for="(site, i) in sites" :key="i" :value="$route.path.includes(`/sites/${site.id}`)" :link="true" :to="`/sites/${site.id}/pages`">
        <v-list-item-icon>
          <v-icon size="20" v-text="`mdi-file-document-multiple`"></v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ site.name }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-subheader>Content</v-subheader>
    <v-list>
      <v-list-item :link="true" to="/qa/categories">
        <v-list-item-icon>
          <v-icon>mdi-shape</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Categories</v-list-item-title>
      </v-list-item>

      <v-list-item :link="true" to="/qa/questions">
        <v-list-item-icon>
          <v-icon>mdi-frequently-asked-questions</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Questions</v-list-item-title>
      </v-list-item>

      <v-list-item :link="true" to="/forms">
        <v-list-item-icon>
          <v-icon>mdi-form-textbox</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Forms</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-subheader>Configuration</v-subheader>
    <v-list>
      <v-list-item :link="true" to="/sites" :exact="true">
        <v-list-item-icon>
          <v-icon>mdi-web</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Sites</v-list-item-title>
      </v-list-item>

      <v-list-item :link="true" to="/environments" :exact="true">
        <v-list-item-icon>
          <v-icon>mdi-cube-scan</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Publishing environments</v-list-item-title>
      </v-list-item>

      <v-list-item :link="true" to="/locales">
        <v-list-item-icon>
          <v-icon>mdi-earth</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Locales</v-list-item-title>
      </v-list-item>

      <v-list-item :link="true" to="/translations">
        <v-list-item-icon>
          <v-icon>mdi-translate</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Translations</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-subheader>Admin</v-subheader>
    <v-list>
      <v-list-item :link="true" to="/logs">
        <v-list-item-icon>
          <v-icon>mdi-table-question</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Activity logs</v-list-item-title>
      </v-list-item>
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
      const { data, error } = await this.$api('/sites');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', {
          message: 'Failed to load sites.',
          type: 'error'
        });
      }
      this.$set(this.$data, 'sites', data);
    },
    methods: {
      clickSite() {}
    }
  };
</script>

<style lang="scss" scoped>
  @import './style';
</style>
