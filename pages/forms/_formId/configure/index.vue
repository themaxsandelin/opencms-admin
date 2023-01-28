<template>
  <div>
    <h1>{{ form.name }}</h1>
    <form-tabs />

    <form-editor
      :editing="true"
      :name="form.name"
      :versions="versions"
      :selected-version="selectedVersion"
      :publishing-environments="publishingEnvironments"
      @version-change="versionSelection"
      @save="patchUpdates"
      @publish="publish"
    />
  </div>
</template>

<script>
// Components
  import FormEditor from '@/components/organisms/form-editor';
  import FormTabs from '@/components/molecules/form-tabs';

  export default {
    name: 'ConfigureFormPage',
    components: {
      FormEditor,
      FormTabs
    },
    data() {
      return {
        form: {
          name: ''
        },
        versions: [],
        selectedVersion: null,
        publishingEnvironments: []
      };
    },
    async fetch() {
      if (!this.form.id) {
        await this.updateForm();
      }
      if (!this.versions.length) {
        await this.updateVersions();
      }
      if (!this.publishingEnvironments.length) {
        await this.updatePublishingEnvironments();
      }
    },
    methods: {
      selectLatestVersion() {
        this.$set(this.$data, 'selectedVersion', this.versions.length ? this.versions[0] : null);
      },
      versionSelection(versionId) {
        const version = this.versions.find((version) => version.id === versionId);
        if (version) {
          this.$set(this.$data, 'selectedVersion', version);
        }
      },
      async updateForm() {
        const { formId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}`);
        if (error) {
          console.error('Failed to load form by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'form', data);
      },
      async updateVersions() {
        const { formId } = this.$route.params;
        const { data, error } = await this.$api(`/forms/${formId}/versions`);
        if (error) {
          console.error('Failed to load form versions by id', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'versions', data);
        if (!this.selectedVersion) {
          this.selectLatestVersion();
        } else {
          this.versionSelection(this.selectedVersion.id);
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
      async patchUpdates({ name, version }) {
        if (this.form.name !== name) {
          // Update form name
          const formBody = {
            name
          };

          const { error: formError } = await this.$api(`/forms/${this.form.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formBody)
          });
          if (formError) {
            console.error('Failed to update form', formError);
            return this.$store.commit('alert/set', { type: 'error', message: formError });
          }
          await this.updateForm();
        }

        const createVersion = version.wasPublished;
        const versionsBody = {
          config: { ...version.config }
        };
        let method = 'POST';
        let url = `/forms/${this.form.id}/versions`;
        if (!createVersion) {
          method = 'PATCH';
          url += `/${version.id}`;
        }
        const { error: versionError } = await this.$api(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(versionsBody)
        });
        if (versionError) {
          console.error('Failed to update form', versionError);
          return this.$store.commit('alert/set', { type: 'error', message: versionError });
        }

        if (createVersion) {
          this.$set(this.$data, 'selectedVersion', null);
        }
        this.updateVersions();
      },
      async publish(publishToEnvironments) {
        if (!publishToEnvironments.length) {
          return;
        }

        const failed = [];
        const succeeded = [];
        await Promise.all(
          publishToEnvironments.map(async (environment) => {
            const { error } = await this.$api(`/forms/${this.form.id}/versions/${this.selectedVersion.id}/publish`, {
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
              });
            }
          })
        );

        if (failed.length) {
          const [attempt] = failed;
          console.error('Publishing error', attempt.error);
          return this.$store.commit('alert/set', { type: 'error', message: attempt.error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Form version published!' });
        this.updateVersions();
      }
    }
  };
</script>
