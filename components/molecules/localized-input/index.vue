<template>
  <div class="localized-input">
    <v-autocomplete :items="localeList" :value="localeCode" label="Language" placeholder="Select the langauge.." @change="languageSelection" />
    <v-text-field v-model="inputValue" :label="label" :placeholder="placeholder" :disabled="!localeCode" @input="inputChange" />
  </div>
</template>

<script>
  export default {
    name: 'LocalizedInput',
    props: {
      value: {
        type: Object,
        default: () => ({})
      },
      label: {
        type: String,
        default: 'Localized text'
      },
      placeholder: {
        type: String,
        default: 'Enter your localized text here..'
      }
    },
    data() {
      const defaultValue = {
        type: 'localized-input',
        values: {}
      };
      const localValue = Object.keys(this.value).length ? {...this.value} : defaultValue;
      const initialLocaleCodes = Object.keys(localValue.values);

      let localeCode = '';
      if (initialLocaleCodes.length) {
        localeCode = Object.prototype.hasOwnProperty.call(initialLocaleCodes, 'sv-SE') ? 'sv-SE' : initialLocaleCodes[0];
      }
      return {
        locales: [],
        inputValue: localeCode ? localValue.values[localeCode] : '',
        localeCode,
        defaultValue,
        localValue,
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/locales');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }
      this.$set(this.$data, 'locales', data);
    },
    computed: {
      localeList() {
        return this.locales.map(locale => ({
          text: `${locale.code} - ${locale.name}`,
          value: locale.code
        }));
      }
    },
    watch: {
      value() {
        this.$set(this.$data, 'localValue', Object.keys(this.value).length ? this.value : { ...this.defaultValue });
      }
    },
    methods: {
      languageSelection(localeCode) {
        this.$set(this.$data, 'localeCode', localeCode);
        const inputValue = Object.prototype.hasOwnProperty.call(this.localValue.values, localeCode) ? this.localValue.values[localeCode] : '';
        this.$set(this.$data, 'inputValue', inputValue);
      },
      inputChange(value) {
        const localValue = {...this.localValue};
        if (value) {
          localValue.values[this.localeCode] = value;
        } else if (!value && Object.prototype.hasOwnProperty.call(localValue.values, this.localeCode)) {
          delete localValue.values[this.localeCode];
        }
        this.$set(this.$data, 'localValue', localValue);
        this.$emit('input', localValue);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
