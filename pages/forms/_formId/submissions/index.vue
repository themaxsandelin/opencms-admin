<template>
  <div>
    <h1>{{ form.name }}</h1>
    <form-tabs />

    <v-data-table :loading="$fetchState.pending" loading-text="Loading submissions... Please wait" :headers="headers" :items="submissions" @click:row="submissionRowClick">
      <template #item.data="{ item }">
        <span>{{ item.data.name || item.data.email }}</span>
      </template>
      <template #item.localeCode="{ item }">
        <span><locale-icon :locale="item.localeCode" /> {{ item.localeCode }}</span>
      </template>
      <template #item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// Components
  import FormTabs from '@/components/molecules/form-tabs';
  import LocaleIcon from '@/components/molecules/locale-icon';

  export default {
    name: 'FormSubmissions',
    components: {
      FormTabs,
      LocaleIcon
    },
    data() {
      return {
        form: {
          name: ''
        },
        submissions: [],
        headers: [
          {
            text: 'Site',
            value: 'site.name'
          },
          {
            text: 'Data',
            value: 'data'
          },
          {
            text: 'Locale',
            value: 'localeCode'
          },
          {
            text: 'Environment',
            value: 'environment.name'
          },
          {
            text: 'Submitted',
            value: 'createdAt'
          }
        ]
      };
    },
    async fetch() {
      if (!this.form.id) {
        await this.updateForm();
      }
      if (!this.submissions.length) {
        await this.updateSubmissions();
      }
    },
    methods: {
      async updateForm() {
        const { formId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}`);
        if (error) {
          console.error('Failed to load form by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'form', data);
      },
      async updateSubmissions() {
        const { formId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}/submissions`);
        if (error) {
          console.error('Failed to load form submissions by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'submissions', data);
      },
      submissionRowClick(item) {
        this.$router.push({ path: `${this.$route.path}/${item.id}` });
      }
    }
  };
</script>
