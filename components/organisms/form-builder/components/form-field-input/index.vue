<template>
  <div class="form-field-input">
    <label v-if="label">{{ label }}</label>
    <div style="right: 0px; position: absolute; width: 100%; text-align: right">
      <span v-for="locale in labelLocales" :key="locale.value">
        <locale-icon v-if="config.label.values[locale]" :locale="locale" :title="config.label.values[locale]" />
      </span>
    </div>
    <input type="text" :placeholder="placeholder" disabled />
  </div>
</template>

<script>
  import LocaleIcon from '@/components/molecules/locale-icon';

  export default {
    name: 'FormFieldInput',
    components: {
      LocaleIcon
    },
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      labelLocales() {
        const { label } = this.config;
        if (label && label.values) {
          return Object.keys(label.values);
        }
        return [];
      },
      label() {
        const { label } = this.config;
        if (label && label.values) {
          const locales = Object.keys(label.values);
          return label.values[locales.includes('sv-SE') ? 'sv-SE' : locales[0]];
        }
        return '';
      },
      placeholder() {
        const { placeholder } = this.config;
        if (placeholder && placeholder.values) {
          const locales = Object.keys(placeholder.values);
          return placeholder.values[locales.includes('sv-SE') ? 'sv-SE' : locales[0]];
        }
        return '';
      }
    }
  };
</script>

<style lang="scss" scoped>
@import './style';
</style>
