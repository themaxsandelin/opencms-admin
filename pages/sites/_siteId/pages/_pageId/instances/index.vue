<template>
  <div>
    <h1>Instances</h1>
    <page-tabs />

    <v-btn color="primary" dark @click="showInstanceForm">Create new instance</v-btn>

    <instance-form
      :instance="editingInstance"
      :visible="instanceFormVisible"
      :instances="instances"
      @hide="hideInstanceForm"
      @created="createdCallback"
      @updated="updatedCallback"
      @deleted="deletedCallback"
    />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="$fetchState.pending"
        loading-text="Loading page instances... Please wait"
        :headers="headers"
        :items="instances"
        :search="search"
        @click:row="instanceRowClick"
      >
        <template #item.title="{ item }">
          <router-link :to="instanceLink(item)">
            <span>
              {{ item.title }}
            </span>
          </router-link>
        </template>
        <template #item.slug="{ item }">
          <router-link :to="instanceLink(item)">
            <span>
              {{ item.slug }}
            </span>
          </router-link>
        </template>
        <template #item.path="{ item }">
          <router-link :to="instanceLink(item)">
            <span>
              {{ item.path }}
            </span>
          </router-link>
        </template>
        <template #item.localeCode="{ item }">
          <router-link :to="instanceLink(item)">
            <span> <locale-icon :locale="item.localeCode" :title="item.title" /> {{ item.localeCode }} </span>
          </router-link>
        </template>
        <template #item.updatedBy="{ item }">
          <span>{{ new Date(item.updatedAt).toLocaleString() }} by {{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
// Components
  import PageTabs from '@/components/molecules/page-tabs';
  import InstanceForm from '@/components/organisms/instance-form';
  import LocaleIcon from '@/components/molecules/locale-icon';

  export default {
    name: 'PageInstances',
    components: {
      PageTabs,
      InstanceForm,
      LocaleIcon
    },
    data() {
      return {
        search: '',
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
      instanceLink(instance) {
        return `${this.$route.path}/${instance.id}`;
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
      deletedCallback() {
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
