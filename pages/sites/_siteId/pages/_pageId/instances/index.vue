<template>
  <div>
    <page-tabs />

    <h1>Instances</h1>

    <v-btn color="primary" dark @click="showInstanceForm">Create new instance</v-btn>

    <instance-form
      :instance="editingInstance"
      :visible="instanceFormVisible"
      @hide="hideInstanceForm"
      @created="createdCallback"
      @updated="updatedCallback"
    />

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
      <template v-slot:item.updatedBy="{ item }">
        <span>{{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdBy="{ item }">
        <span>{{ item.createdBy.firstName }} {{ item.createdBy.lastName }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editInstance($event, item)">
          Edit
        </v-btn>
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
            text: 'Updated by',
            value: 'updatedBy'
          },
          {
            text: 'Created',
            value: 'createdAt'
          },
          {
            text: 'Created by',
            value: 'createdBy'
          },
          {
            text: '',
            value: 'actions'
          }
        ],
        instanceFormVisible: false,
        editingInstance: null
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
      },
      updatedCallback() {
        this.$set(this.$data, 'editingInstance', null);
        this.$fetch();
      },
      editInstance(event, instance) {
        event.stopPropagation();
        this.$set(this.$data, 'editingInstance', instance);
        this.showInstanceForm();
      }
    }
  };
</script>
