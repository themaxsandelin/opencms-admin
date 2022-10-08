<template>
  <div>
    <v-layout>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-autocomplete label="Choose a language..." outlined :items="localeList" :value="selectedLocale" @change="localeChange"></v-autocomplete>
          <v-btn color="primary" @click="save">
            Save changes
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="6">
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
    </v-layout>
    <component :is="component" v-if="isValidComponent && selectedVersion" ref="editor" v-bind="selectedVersion" />
  </div>
</template>

<script>
  // Components
  const components = {
    'question': () => import('@/components/organisms/question-editor'),
    'question-category': () => import('@/components/organisms/question-category-editor')
  };

  export default {
    name: 'ContentBlockEditor',
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
      },
      // version: {
      //   type: Object,
      //   default: () => ({})
      // }
    },
    data() {
      return {
        locales: [],
        selectedLocale: '',
        versions: [],
        publishingEnvironments: [],
        publishToEnvironments: [],
        selectedVersion: null,
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
          value: environment.key,
          disabled: this.selectedEnvironments.includes(environment.key)
        }))
      },
      selectedEnvironments() {
        return this.selectedVersion && this.selectedVersion.publications ? this.selectedVersion.publications.map(publication => publication.environment.key) : [];
      }
    },
    methods: {
      localeChange(localeCode) {
        this.$set(this.$data, 'selectedLocale', localeCode);
        this.$router.push({ query: { ...this.$route.query, locale: localeCode } });
        this.$fetch();
      },
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
      async updateLocales() {
        const { data, error } = await this.$api('/locales');
        if (error) {
          console.error('Failed to load locales', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load locales.' });
        }
        this.$set(this.$data, 'locales', data);
        if (this.$route.query.locale) {
          this.$set(this.$data, 'selectedLocale', this.$route.query.locale);
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
        const { data, error } = await this.$api(`/content-blocks/${this.block.id}/variants/${this.variant.id}/versions?locale=${this.selectedLocale}`);
        this.$set(this.$data, 'fetchingVersions', false);
        if (error) {
          console.error('Failed to load versions', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load versions.' });
        }
        this.$set(this.$data, 'versions', data);
        this.selectLatestVersion();
      },
      async publish() {
        if (!this.publishToEnvironments.length) {
          return;
        }

        const { error } = await this.$api(`/content-blocks/${this.block.id}/variants/${this.variant.id}/versions/${this.selectedVersion.id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            environments: this.publishToEnvironments
          })
        });
        if (error) {
          console.error('Publishing error', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to publish content block variant version.' });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Content block version published!' });
        this.updateVersions();
      },
      async save() {
        const content = await this.$refs.editor.save();
        const { locale } = this.selectedVersion;

        const updating = !!this.selectedVersion.id;
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
            locale
          })
        });
        if (error) {
          console.error('Content block save/update error', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to update content block variant version.' });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Content block version saved!' });
        this.updateVersions();
      }
    }
  };
</script>
