<template>
  <div>
    <v-layout column>
      <v-row>
        <v-col cols="12" sm="4" md="4" lg="4">
          <v-autocomplete label="Choose a language..." outlined :items="localeList" :value="selectedLocale" @change="localeChange"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4">
          <version-selector :selected-version="selectedVersion" :versions="versions" @selection="versionSelection" />
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4">
          <v-select
            v-if="environmentList.length && selectedLocale"
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
      <v-row>
        <v-col cols="12" lg="12" md="12" sm="12">
          <v-btn color="primary" @click="save">
            Save changes
          </v-btn>
        </v-col>
      </v-row>
    </v-layout>

    <template v-if="selectedLocale && selectedVersion">
      <v-divider />
      <v-subheader>Generic config</v-subheader>
      <v-text-field v-model="selectedVersion.slug" label="Content block slug" placeholder="Ex. /this-is-a-slug" />

      <v-divider />

      <v-subheader>Type specific content</v-subheader>
      <component :is="component" v-if="isValidComponent && selectedVersion" ref="editor" v-bind="selectedVersion" />
    </template>
  </div>
</template>

<script>
  // Components
  import VersionSelector from '@/components/molecules/version-selector';

  // Async components
  const components = {
    'question': () => import('@/components/organisms/question-editor'),
    'question-category': () => import('@/components/organisms/question-category-editor')
  };

  export default {
    name: 'ContentBlockEditor',
    components: {
      VersionSelector
    },
    props: {
      type: {
        type: String,
        required: true
      },
      block: {
        type: Object,
        required: true
      },
      variant: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        defaultVersion: {},
        locales: [],
        selectedLocale: '',
        versions: [],
        publishingEnvironments: [],
        publishToEnvironments: [],
        selectedVersion: {},
        fetchingVersions: false
      };
    },
    async fetch() {
      if (!this.locales.length) {
        await this.updateLocales();
      }
      if (!this.publishingEnvironments.length) {
        await this.updatePublishingEnvironments();
      }
      if (this.selectedLocale) {
        await this.updateVersions();
      }
    },
    computed: {
      isValidComponent() {
        return Boolean(components[this.type]);
      },
      component() {
        return components[this.type];
      },
      localeList() {
        return this.locales.map(locale => ({
          text: `${locale.code} - ${locale.name}`,
          value: locale.code
        }));
      },
      environmentList() {
        return this.publishingEnvironments.map(environment => ({
          text: environment.name,
          value: environment.id,
          disabled: this.selectedEnvironments.includes(environment.id)
        }))
      },
      selectedEnvironments() {
        return this.selectedVersion.publications ? this.selectedVersion.publications.map(publication => publication.environment.id) : [];
      }
    },
    methods: {
      localeChange(localeCode) {
        this.$set(this.$data, 'selectedLocale', localeCode);
        this.$router.push({ query: { ...this.$route.query, localeCode } });
        this.$fetch();
      },
      getBaseVersionData() {
        return {
          localeCode: this.selectedLocale,
          slug: '',
          content: {
            question: '',
            answer: {
              blocks: []
            }
          }
        };
      },
      selectLatestVersion() {
        this.$set(this.$data, 'selectedVersion', this.versions.length ? this.versions[0] : this.getBaseVersionData());
      },
      publishChange(data) {
        this.$set(this.$data, 'publishToEnvironments', data);
      },
      versionSelection(versionId) {
        const version = this.versions.find(version => version.id === versionId);
        if (version) {
          this.$set(this.$data, 'selectedVersion', version);
        }
      },
      async updateLocales() {
        const { data, error } = await this.$api('/locales');
        if (error) {
          console.error('Failed to load locales', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load locales.' });
        }
        this.$set(this.$data, 'locales', data);
        if (this.$route.query.localeCode) {
          this.$set(this.$data, 'selectedLocale', this.$route.query.localeCode);
        }
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
        this.$set(this.$data, 'fetchingVersions', true);
        const { data, error } = await this.$api(`/content-blocks/${this.block.id}/variants/${this.variant.id}/versions?localeCode=${this.selectedLocale}`);
        this.$set(this.$data, 'fetchingVersions', false);
        if (error) {
          console.error('Failed to load versions', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
        this.$set(this.$data, 'versions', data);
        if (!this.selectedVersion.id || this.selectedVersion.localeCode !== this.selectedLocale) {
          this.selectLatestVersion();
        } else {
          this.versionSelection(this.selectedVersion.id);
        }
      },
      async publish() {
        if (!this.publishToEnvironments.length) {
          return;
        }

        const failed = [];
        const succeeded = [];
        await Promise.all(
          this.publishToEnvironments.map(async (environment) => {
            const { error } = await this.$api(`/content-blocks/${this.block.id}/variants/${this.variant.id}/versions/${this.selectedVersion.id}/publish`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                environment
              })
            });
            if (error) {
              failed.push({
                environment,
                error
              });
            } else {
              succeeded.push({
                environment
              })
            }
          })
        );

        if (failed.length) {
          const [ attempt ] = failed;
          console.error('Publishing error', attempt.error);
          return this.$store.commit('alert/set', { type: 'error', message: attempt.error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Content block version published!' });
        this.updateVersions();
      },
      async save() {
        const content = await this.$refs.editor.save();
        const { slug, localeCode } = this.selectedVersion;

        const wasPublished = this.selectedVersion.wasPublished || false;
        const updating = !!this.selectedVersion.id && !wasPublished;
        const method = updating ? 'PATCH' : 'POST';
        let uri = `/content-blocks/${this.block.id}/variants/${this.variant.id}/versions`;
        if (updating) {
          uri += `/${this.selectedVersion.id}`;
        }

        const { error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content,
            localeCode,
            slug
          })
        });
        if (error) {
          console.error('Content block save/update error', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Content block version saved!' });
        if (wasPublished) {
          this.$set(this.$data, 'selectedVersion', this.getBaseVersionData());
        }
        this.updateVersions();
      }
    }
  };
</script>
