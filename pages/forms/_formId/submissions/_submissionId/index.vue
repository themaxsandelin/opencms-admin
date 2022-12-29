<template>
  <div>
    <h1>{{ form.name }} - Submission</h1>
    <form-tabs />

    <template v-if="submission">
      <div v-if="dynamicPath.length" class="submission-row">
        <h3>Path</h3>
        <span v-for="(item, i) in dynamicPath" :key="i"> / {{ item.value }} </span>
      </div>

      <div class="submission-row">
        <h3>Form data</h3>
        <v-card outlined>
          <v-simple-table>
            <template #default>
              <tbody>
                <tr v-for="(item, i) in formData" :key="i">
                  <td>{{ item.key }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </div>

      <template v-if="files.length">
        <div class="submission-row">
          <h3>Files</h3>
          <file-grid :files="files" />
        </div>
      </template>

      <div v-if="dynamicData.length" class="submission-row">
        <h3>Dynamic data</h3>
        <v-card outlined>
          <v-simple-table>
            <template #default>
              <tbody>
                <tr v-for="(item, i) in dynamicData" :key="i">
                  <td>{{ item.key }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </div>
    </template>
  </div>
</template>

<script>
// Components
  import FormTabs from '@/components/molecules/form-tabs';
  import FileGrid from '@/components/organisms/file-grid';

  export default {
    name: 'FormSubmissionPage',
    components: {
      FormTabs,
      FileGrid
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
        return keys
          .filter((key) => key !== 'dynamic')
          .map((key) => ({
            key,
            value: this.submission.data[key]
          }));
      },
      dynamicData() {
        const dataKeys = Object.keys(this.submission.data);
        if (!dataKeys.includes('dynamic')) {
          return [];
        }
        const keys = Object.keys(this.submission.data.dynamic);
        return keys
          .filter((key) => !key.startsWith('page'))
          .map((key) => ({
            key,
            value: this.submission.data.dynamic[key]
          }));
      },
      dynamicPath() {
        const dataKeys = Object.keys(this.submission.data);
        if (!dataKeys.includes('dynamic')) {
          return [];
        }
        const keys = Object.keys(this.submission.data.dynamic);
        return keys
          .filter((key) => key.startsWith('page'))
          .map((key) => ({
            key,
            value: this.submission.data.dynamic[key]
          }));
      },
      files() {
        const { submissionId, formId } = this.$route.params;
        return this.submission.files.map((file) => ({
          ...file,
          url: `/api/forms/${formId}/submissions/${submissionId}/files/${file.id}/file`
        }));
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
      async updateSubmission() {
        const { formId, submissionId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}/submissions/${submissionId}`);
        if (error) {
          console.error('Failed to load form by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'submission', data);
      }
    }
  };
</script>

<style lang="scss" scoped>
.submission-row {
  width: 100%;
  margin: 24px 0 0;

  h3 {
    margin: 0 0 12px;
  }
}
</style>
