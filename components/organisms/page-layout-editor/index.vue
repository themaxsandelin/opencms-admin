<template>
  <div>
    Page layout editor
    <v-layout>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-btn color="primary" @click="save">
            Save changes
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="6">
          <v-select
            v-if="environmentList.length"
            label="Publish"
            :items="environmentList"
            :value="selectedEnvironments"
            outlined
            chips
            multiple
            @change="publishChange"
            @blur="publish"
          ></v-select>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'PageLayoutEditor',
    props: {
      page: {
        type: Object,
        required: true
      },
      layout: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        versions: [],
        publishingEnvironments: [],
        publishToEnvironments: [],
        selectedVersion: null,
        fetchingVersions: false
      };
    },
    async fetch() {
      if (!this.publishingEnvironments.length) {
        await this.updatePublishingEnvironments();
      }
      if (this.selectedLocale) {
        await this.updateVersions();
      }
    },
    computed: {
      environmentList() {
        return this.publishingEnvironments.map(environment => ({
          text: environment.name,
          value: environment.key,
          disabled: this.selectedEnvironments.includes(environment.key)
        }))
      },
      selectedEnvironments() {
        return this.selectedVersion && this.selectedVersion.publications ? this.selectedVersion.publications.map(publication => publication.environment.key) : [];
      }
    },
    methods: {
      selectLatestVersion() {
        this.$set(this.$data, 'selectedVersion', this.versions.length ? this.versions[0] : {
          locale: this.selectedLocale,
          content: {
            question: '',
            answer: {
              blocks: []
            }
          }
        });
      },
      publishChange(data) {
        this.$set(this.$data, 'publishToEnvironments', data);
      },
      async updatePublishingEnvironments() {
        const { data, error } = await this.$api('/publishing-environments');
        if (error) {
          console.error('Failed to load publishing environments', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load publishing environments.' });
        }
        this.$set(this.$data, 'publishingEnvironments', data);
      },
      async updateVersions() {
        const { layoutId, pageId, siteId } = this.$route.params;

        this.$set(this.$data, 'fetchingVersions', true);
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions`);
        this.$set(this.$data, 'fetchingVersions', false);
        if (error) {
          console.error('Failed to load versions', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load versions.' });
        }

        this.$set(this.$data, 'versions', data);
        this.selectLatestVersion();
      },
      save() {},
      publish() {}
    }
  };
</script>
