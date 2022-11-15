<template>
  <div>
    <h1>{{ form.name }} - Submission</h1>
    <form-tabs />

    <template v-if="submission">
      <h3>Meta data</h3>
      <v-card outlined>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Site</td>
                <td>{{ submission.site.name }}</td>
              </tr>
              <tr>
                <td>Locale</td>
                <td>{{ submission.localeCode }}</td>
              </tr>
              <tr>
                <td>Environment</td>
                <td>{{ submission.environment.name }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>

      <h3>Form data</h3>
      <v-card outlined>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="(item, i) in formData" :key="i">
                <td>{{ item.key }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </template>
  </div>
</template>

<script>
  // Components
  import FormTabs from '@/components/molecules/form-tabs';

  export default {
    name: 'FormSubmissionPage',
    components: {
      FormTabs
    },
    data() {
      return {
        form: {
          name: ''
        },
        submission: null
      };
    },
    async fetch() {
      if (!this.form.id) {
        await this.updateForm();
      }
      if (!this.submission) {
        await this.updateSubmission();
      }
    },
    computed: {
      formData() {
        const keys = Object.keys(this.submission.data);
        return keys.map(key => ({
          key,
          value: this.submission.data[key]
        }))
      },
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
      async updateSubmission() {
        const { formId, submissionId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}/submissions/${submissionId}`);
        if (error) {
          console.error('Failed to load form by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        console.log(data);

        this.$set(this.$data, 'submission', data);
      }
    }
  };
</script>
