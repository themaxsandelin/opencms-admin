<template>
  <div class="localized-input">
    <v-autocomplete :items="localeList" :value="localeCode" label="Language" placeholder="Select the langauge.." @change="languageSelection" />
    <v-text-field v-model="inputValue" :label="label" :placeholder="placeholder" :disabled="!localeCode" @input="inputChange" />
  </div>
</template>

<script>
  // Utils
  import { getLocalizedInputDefaultValue } from '@/utils/fields';

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
      const defaultValue = getLocalizedInputDefaultValue();

      const { localeCode, localValue } = this.parseValue(this.value, defaultValue);

      return {
        locales: [],
        inputValue: localeCode ? localValue.values[localeCode] : '',
        localeCode,
        defaultValue,
        localValue
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
        return this.locales
          .map((locale) => ({
            text: `${locale.name} (${locale.code})`,
            value: locale.code
          }))
          .sort((a, b) => {
            return a.text.localeCompare(b.text);
          });
      }
    },
    watch: {
      value() {
        const { localeCode, localValue } = this.parseValue(this.value, this.defaultValue);
        this.$set(this.$data, 'localValue', localValue);
        if (!Object.prototype.hasOwnProperty.call(this.localValue.values, this.localeCode)) {
          this.$set(this.$data, 'localeCode', localeCode);
        }
        if (this.localeCode) {
          this.$set(this.$data, 'inputValue', this.localValue.values[this.localeCode]);
        }
      }
    },
    methods: {
      languageSelection(localeCode) {
        this.$set(this.$data, 'localeCode', localeCode);
        const inputValue = Object.prototype.hasOwnProperty.call(this.localValue.values, localeCode) ? this.localValue.values[localeCode] : '';
        this.$set(this.$data, 'inputValue', inputValue);
      },
      parseValue(value, defaultValue) {
        let previousValue;
        const localValue = Object.keys(value).length ? { ...value } : defaultValue;
        if (localValue.values.previous) {
          previousValue = localValue.values.previous;
          delete localValue.values.previous;
        }
        const initialLocaleCodes = Object.keys(localValue.values);

        let localeCode = '';
        if (previousValue) {
          localeCode = 'sv-SE';
          localValue.values[localeCode] = previousValue;
        } else if (initialLocaleCodes.length) {
          localeCode = Object.prototype.hasOwnProperty.call(initialLocaleCodes, 'sv-SE') ? 'sv-SE' : initialLocaleCodes[0];
        }
        return {
          localValue,
          localeCode
        };
      },
      inputChange(value) {
        const localValue = { ...this.localValue };
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
@import './style';
</style>
