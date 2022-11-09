<template>
  <div>
    <h1>New form</h1>
    <form-editor :form="form" @save="createForm" />
  </div>
</template>

<script>
  // Components
  import FormEditor from '@/components/organisms/form-editor';

  export default {
    name: 'NewFormPage',
    components: {
      FormEditor,
    },
    data() {
      return {
        form: {
          name: '',
          fields: []
        }
      };
    },
    methods: {
      async createForm({ name, version }) {
        const formBody = { name };

        const { data: form, error: formError } = await this.$api('/forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formBody)
        });
        if (formError) {
          console.error('Failed to create form', formError);
          return this.$store.commit('alert/set', { type: 'error', message: formError });
        }

        const { id } = form;

        const versionBody = {...version};
        const { versionError } = await this.$api(`/forms/${id}/versions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(versionBody)
        });
        if (versionError) {
          console.error('Failed to create form version', versionError);
          return this.$store.commit('alert/set', { type: 'error', message: versionError });
        }

        this.$router.push({ path: `${this.$route.path}/${id}` });
      }
    }
  };
</script>
