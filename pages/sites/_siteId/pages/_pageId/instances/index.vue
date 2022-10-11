<template>
  <div>
    <page-tabs />

    <h1>Instances</h1>

    <v-btn color="primary" dark @click="showInstanceForm">Create new instance</v-btn>

    <instance-form :visible="instanceFormVisible" @hide="hideInstanceForm" @created="createdCallback" />

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading page instances... Please wait"
      :headers="headers"
      :items="instances"
      @click:row="instanceRowClick"
    >
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // Components
  import PageTabs from '@/components/molecules/page-tabs';
  import InstanceForm from '@/components/organisms/instance-form';

  export default {
    name: 'PageInstances',
    components: {
      PageTabs,
      InstanceForm
    },
    data() {
      return {
        instances: [],
        headers: [
          {
            text: 'Title',
            value: 'title',
            align: 'start'
          },
          {
            text: 'Slug',
            value: 'slug'
          },
          {
            text: 'Path',
            value: 'path'
          },
          {
            text: 'Locale',
            value: 'localeCode'
          },
          {
            text: 'Updated',
            value: 'updatedAt'
          },
          {
            text: 'Created',
            value: 'createdAt'
          }
        ],
        instanceFormVisible: false
      };
    },
    async fetch() {
      const { siteId, pageId } = this.$route.params;
      const { data, error } = await this.$api(`/sites/${siteId}/pages/${pageId}/instances`);
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }
      this.$set(this.$data, 'instances', data);
    },
    methods: {
      instanceRowClick(instance) {
        this.$router.push(`${this.$route.path}/${instance.id}`);
      },
      showInstanceForm() {
        this.instanceFormVisible = true;
      },
      hideInstanceForm() {
        this.instanceFormVisible = false;
      },
      createdCallback() {
        this.$fetch();
      }
    }
  };
</script>
