<template>
  <div>
    <page-tabs />

    <v-subheader>Page instance</v-subheader>
    <h1>{{ instance.title }}</h1>

    <v-divider />

    <h2>Data</h2>
    <v-layout column>
      <v-row>
        <v-col cols="12" lg="6" md="6" sm="6">
          <v-select v-model="instanceChanges.data.source" label="Data source" :items="dataOptions.sources" />
        </v-col>
        <v-col cols="12" lg="6" md="6" sm="6">
          <v-select v-model="instanceChanges.data.type" label="Data type" :items="dataOptions.types" />
        </v-col>
      </v-row>
    </v-layout>

    <v-divider />

    <h2>Layouts</h2>
    <v-layout column>
      <v-row v-for="(environment, i) in publishingEnvironments" :key="i">
        <v-col cols="12" lg="3" md="3" sm="3">
          <h4>{{ environment.name }}</h4>
        </v-col>
        <v-col cols="12" lg="9" md="9" sm="9">
          <v-select
            :items="layoutList"
            label="Select a layout.."
            :value="layoutEnvironments[environment.id]"
            @change="layoutChange($event, environment.id)"
          />
        </v-col>
      </v-row>
    </v-layout>

    <v-btn color="primary" :disabled="!changesMade" @click="save">Save changes</v-btn>
  </div>
</template>

<script>
  // Components
  import PageTabs from '@/components/molecules/page-tabs';

  export default {
    name: 'InstancePage',
    components: {
      PageTabs
    },
    data() {
      return {
        instance: {},
        publishingEnvironments: [],
        layouts: [],
        layoutEnvironments: {},
        instanceChanges: {
          data: {
            source: undefined,
            type: undefined
          },
          environments: {}
        },
        dataOptions: {
          sources: [
            {
              text: 'Route parameter',
              value: 'route-parameter'
            }
          ],
          types: [
            {
              text: 'Question category (Content Type)',
              value: 'content-type_question-category'
            },
            {
              text: 'Question (Content Type)',
              value: 'content-type_question'
            }
          ]
        }
      };
    },
    async fetch() {
      if (!this.instance.id) {
        await this.updateInstance();
        await this.updateInstanceLayouts();
      }
      if (!this.publishingEnvironments.length) {
        await this.updatePublishingEnvironments();
      }
      if (!this.layouts.length) {
        await this.updateLayouts();
      }
    },
    computed: {
      layoutList() {
        return this.layouts.map(layout => ({
          text: layout.name,
          value: layout.id
        }))
      },
      instanceData() {
        return this.instance.config && this.instance.config.data ? this.instance.config.data : {};
      },
      changesMade() {
        return (
          (Object.keys(this.instanceChanges.environments).length > 0) ||
          (
            this.instanceChanges.data.source !== this.instanceData.source &&
            this.instanceChanges.data.type !== this.instanceData.type
          )
        );
      }
    },
    methods: {
      async updateInstance() {
        const { siteId, pageId, instanceId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/instances/${instanceId}`);
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
        this.$set(this.$data, 'instance', data);
        if (data.config && data.config.data) {
          this.$set(this.$data.instanceChanges, 'data', data.config.data);
        }
      },
      async updateInstanceLayouts() {
        const { siteId, pageId, instanceId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/instances/${instanceId}/layouts`);
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
        const layoutEnvironments = {};
        data.forEach((instanceLayout) => {
          layoutEnvironments[instanceLayout.publishingEnvironmentId] = instanceLayout.pageLayoutId;
        });
        this.$set(this.$data, 'layoutEnvironments', layoutEnvironments);
      },
      async updatePublishingEnvironments() {
        const { data, error } = await this.$api('/publishing-environments');
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
        this.$set(this.$data, 'publishingEnvironments', data);
      },
      async updateLayouts() {
        const { siteId, pageId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts`);
        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
        this.$set(this.$data, 'layouts', data);
      },
      layoutChange(layoutId, environmentKey) {
        const changes = {...this.instanceChanges};
        const selection = {...this.layoutEnvironments};
        changes.environments[environmentKey] = layoutId;

        this.$set(this.$data, 'instanceChanges', changes);
        this.$set(this.$data, 'layoutEnvironments', selection);
      },
      async save() {
        const { data } = this.instanceChanges;
        const environmentIds = Object.keys(this.instanceChanges.environments);
        const { siteId, pageId, instanceId } = this.$route.params;

        try {
          await Promise.all(
            environmentIds.map((publishingEnvironmentId) => {
              const body = {
                publishingEnvironmentId,
                layoutId: this.instanceChanges.environments[publishingEnvironmentId]
              };
              return this.$api(`/sites/${siteId}/pages/${pageId}/instances/${instanceId}/layouts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
              });
            })
          );

          await this.$api(`/sites/${siteId}/pages/${pageId}/instances/${instanceId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              config: { data }
            })
          });

          this.updateInstance();
          this.updateInstanceLayouts();
          this.$store.commit('alert/set', { type: 'success', message: 'Instance layout updated!' });
        } catch (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
      }
    }
  };
</script>
