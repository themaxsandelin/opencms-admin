<template>
  <div>
    <v-layout>
      <v-row>
        <v-col cols="12" sm="3" md="3" lg="3">
          <v-btn color="primary" @click="save">
            Save changes
          </v-btn>
        </v-col>

        <v-col cols="12" sm="5" md="5" lg="5">
          <version-selector :selected-version="selectedVersion" :versions="versions" @selection="versionSelection" />
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4">
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

    <div class="component-wrapper">
      <layout-component-list
        :components="layoutComponents"
        @updated="componentsUpdated"
      />
      <div class="component-wrapper__add">
        <v-btn color="secondary" @click="showComponentSelector">Add component</v-btn>
      </div>
    </div>

    <component-selector :visible="componentSelectorVisible" @hide="hideComponentSelector" @selection="componentSelection" />
  </div>
</template>

<script>
  // Components
  import ComponentSelector from '@/components/organisms/component-selector';
  import LayoutComponentList from '@/components/molecules/layout-component-list';
  import VersionSelector from '@/components/molecules/version-selector';

  // Selectable components
  import configComponents from '@/config/components';

  export default {
    name: 'PageLayoutEditor',
    components: {
      ComponentSelector,
      LayoutComponentList,
      VersionSelector
    },
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
        selectedVersion: {},
        fetchingVersions: false,
        componentSelectorVisible: false,
        layoutComponents: []
      };
    },
    async fetch() {
      if (!this.publishingEnvironments.length) {
        await this.updatePublishingEnvironments();
      }
      if (!this.versions.length) {
        await this.updateVersions();
      }
    },
    computed: {
      environmentList() {
        return this.publishingEnvironments.map(environment => ({
          text: environment.name,
          value: environment.id,
          disabled: this.selectedEnvironments.includes(environment.id)
        }))
      },
      selectedEnvironments() {
        return this.selectedVersion.publications ? this.selectedVersion.publications.map(publication => publication.environmentId) : [];
      }
    },
    watch: {
      layout() {
        this.$set(this.$data, 'selectedVersion', {});
        this.updateVersions();
      },
      selectedVersion() {
        let components = [];
        if (this.selectedVersion.content && this.selectedVersion.content.components) {
          // Complete the lean database component with the full component config.
          components = this.selectedVersion.content.components.map(component => {
            const componentConfig = configComponents.find(configComponent => configComponent.key === component.key);
            if (!componentConfig) {
              return component;
            }
            return {
              ...componentConfig,
              fieldData: component.fieldData || {}
            };
          });
        }
        this.$set(this.$data, 'layoutComponents', components);
      }
    },
    methods: {
      selectLatestVersion() {
        this.$set(this.$data, 'selectedVersion', this.versions.length ? this.versions[0] : {});
      },
      versionSelection(versionId) {
        const version = this.versions.find(version => version.id === versionId);
        if (version) {
          this.$set(this.$data, 'selectedVersion', version);
        }
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
        const { layoutId } = this.$route.query;
        const { pageId, siteId } = this.$route.params;

        this.$set(this.$data, 'fetchingVersions', true);
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions`);
        this.$set(this.$data, 'fetchingVersions', false);
        if (error) {
          console.error('Failed to load versions', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load versions.' });
        }

        this.$set(this.$data, 'versions', data);
        if (!this.selectedVersion.id) {
          this.selectLatestVersion();
        } else {
          const newSelectedVersion = this.versions.find(version => version.id === this.selectedVersion.id);
          if (newSelectedVersion) {
            this.$set(this.$data, 'selectedVersion', newSelectedVersion);
          }
        }
      },
      async save() {
        const { layoutId } = this.$route.query;
        const { siteId, pageId } = this.$route.params;

        let method = 'POST';
        let uri = `/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions`;
        const wasPublished = this.selectedVersion.wasPublished || false;
        if (this.selectedVersion.id && !wasPublished) {
          method = 'PATCH';
          uri += `/${this.selectedVersion.id}`;
        }

        const body = {
          content: {
            components: this.layoutComponents.map(component => ({
              key: component.key,
              fieldData: component.fieldData
            }))
          }
        };

        const { error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Successfully saved changes.' });
        if (wasPublished) {
          this.$set(this.$data, 'selectedVersion', {});
        }
        this.updateVersions();
      },
      async publish() {
        if (!this.publishToEnvironments.length) {
          return;
        }

        const { id: versionId } = this.selectedVersion;
        const { layoutId } = this.$route.query;
        const { siteId, pageId } = this.$route.params;

        const failed = [];
        const succeeded = [];
        await Promise.all(
          this.publishToEnvironments.map(async (environment) => {
            const { error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts/${layoutId}/versions/${versionId}/publish`, {
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

        this.$store.commit('alert/set', { type: 'success', message: 'Page layout published!' });
        this.updateVersions();
      },
      showComponentSelector() {
        this.componentSelectorVisible = true;
      },
      hideComponentSelector() {
        this.componentSelectorVisible = false;
      },
      generateTemporaryComponentId() {
        let id = `${new Date().getTime()}`;
        for (let i = 0; i < 10; i++) {
          const number = Math.floor(Math.random() * (25 - 0 + 1) + 0);
          const character = String.fromCharCode(65 + number);
          id += character;
        }
        return id.split('').sort(() => 0.5 - Math.random()).join('');
      },
      componentSelection(component) {
        const layoutComponents = [...this.layoutComponents];
        layoutComponents.push({
          ...component,
          id: this.generateTemporaryComponentId()
        });
        this.$set(this.$data, 'layoutComponents', layoutComponents);
      },
      componentsUpdated(components) {
        this.$set(this.$data, 'layoutComponents', components);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .component-wrapper {
    width: 100%;
    padding: 10px;
    border: 2px dashed #eee;

    &__add {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
</style>
