<template>
  <div>
    <h1>{{ form.name }}</h1>
    <form-tabs />
  </div>
</template>

<script>
  // Components
  import FormTabs from '@/components/molecules/form-tabs';

  export default {
    name: 'FormPage',
    components: {
      FormTabs
    },
    data() {
      return {
        form: {
          name: ''
        }
      };
    },
    async fetch() {
      if (!this.form.id) {
        await this.updateForm();
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
      }
    }
  };
</script>
