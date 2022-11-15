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
      @delete="attemptDelete"
    />

    <verify-action
      v-bind="deleteDialog"
      @abort="abortDelete"
      @confirm="deleteForm"
    />
  </div>
</template>

<script>
  // Components
  import FormEditor from '@/components/organisms/form-editor';
  import VerifyAction from '@/components/organisms/verify-action';
  import FormTabs from '@/components/molecules/form-tabs';

  export default {
    name: 'ConfigureFormPage',
    components: {
      FormEditor,
      VerifyAction,
      FormTabs
    },
    data() {
      return {
        form: {
          name: ''
        },
        versions: [],
        selectedVersion: null,
        publishingEnvironments: [],
        deleteDialog: {
          type: 'warning',
          title: 'You are about to delete a form',
          text: 'Just a heads up, you are about to delete this form. This will delete both the form, and all of it\'s versions.',
          cancelLabel: 'Abort',
          confirmLabel: 'Delete',
          visible: false
        }
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
        const version = this.versions.find(version => version.id === versionId);
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

        const { error } = await this.$api(`/forms/${this.form.id}/versions/${this.selectedVersion.id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            environments: publishToEnvironments
          })
        });

        if (error) {
          console.error('Publishing error', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Form version published!' });
        this.updateVersions();
      },
      attemptDelete() {
        this.$set(this.$data.deleteDialog, 'visible', true);
      },
      abortDelete() {
        this.$set(this.$data.deleteDialog, 'visible', false);
      },
      async deleteForm() {
        const { error } = await this.$api(`/forms/${this.form.id}`, {
          method: 'DELETE'
        });
        if (error) {
          console.error('Failed to delete form', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$store.commit('alert/set', { type: 'success', message: 'Form successfully deleted!' });
        this.$router.push({ path: '/forms' });
      }
    }
  };
</script>
