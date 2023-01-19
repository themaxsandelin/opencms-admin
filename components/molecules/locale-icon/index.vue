<template>
  <img v-id="iconName" :src="iconName" />
</template>

<script>
  export default {
    name: 'LocaleIcon',
    props: {
      locale: {
        type: String,
        default: ''
      }
    },
    computed: {
      iconName() {
        if (!this.locale) {
          return '';
        }

        const parts = this.locale.toLowerCase().split('-');
        if (parts.length > 1) {
          return `/flags/${parts[1]}.svg`;
        }
        return '';
      }
    }
  };
</script>
<style scoped="true">
img {
  width: 1.2em;
  margin: 0 0.1em;
  border: 1px solid #ccc;
}
</style>
