<template>
  <v-autocomplete :items="localeOptions" :value="code" label="Locale code" placeholder="Select the locale.." @change="localeSelection" />
</template>

<script>
  export default {
    name: 'LocaleOptions',
    props: {
      code: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        options: []
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/locales/options');
      if (error) {
        console.error('Failed to fetch locales options', error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }

      this.$set(this.$data, 'options', data);
    },
    computed: {
      localeOptions() {
        return this.options.map(locale => ({
          text: `${locale.code} - ${locale.name}`,
          value: locale.code
        }));
      }
    },
    methods: {
      localeSelection(code) {
        const locale = this.options.find(option => option.code === code);
        this.$emit('selection', locale);
      }
    }
  };
</script>
