<template>
  <div>
    <page-tabs />

    <v-subheader>Page instance</v-subheader>
    <h1>{{ instance.title }}</h1>

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

    <v-btn color="primary" :disabled="!Object.keys(layoutChanges).length" @click="save">Save changes</v-btn>
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
        layoutChanges: {}
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
        const selection = {...this.layoutEnvironments};
        selection[environmentKey] = layoutId;
        this.$set(this.$data, 'layoutChanges', selection);
        this.$set(this.$data, 'layoutEnvironments', selection);
      },
      async save() {
        const environmentIds = Object.keys(this.layoutChanges);
        if (!environmentIds.length) {
          return this.$store.commit('alert/set', { type: 'warning', message: 'You have to set the layout for each environment before saving' });
        }

        const { siteId, pageId, instanceId } = this.$route.params;

        try {
          await Promise.all(
            environmentIds.map(async (publishingEnvironmentId) => {
              const body = {
                publishingEnvironmentId,
                layoutId: this.layoutChanges[publishingEnvironmentId]
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

          this.updateInstance();
          this.updateInstanceLayouts();
          this.$store.commit('alert/set', { type: 'success', message: 'Instance layouts updated!' });
        } catch (error) {
          console.error(error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }
      }
    }
  };
</script>
