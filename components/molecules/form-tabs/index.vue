<template>
  <v-tabs>
    <v-tab
      v-for="(item, i) in tabs"
      :key="i"
      :link="true"
      :exact="item.exact || false"
      :to="item.url"
    >
      {{ item.text }}
    </v-tab>
  </v-tabs>
</template>

<script>
  export default {
    name: 'FormTabs',
    computed: {
      tabs() {
        return [
          {
            text: 'Overview',
            url: this.formUrl,
            exact: true
          },
          {
            text: 'Submissions',
            url: this.submissionsUrl
          },
          {
            text: 'Configure',
            url: this.configUrl
          }
        ];
      },
      formUrl() {
        return `/forms/${this.$route.params.formId}`;
      },
      submissionsUrl() {
        return `${this.formUrl}/submissions`;
      },
      configUrl() {
        return `${this.formUrl}/configure`;
      }
    }
  };
</script>
