<template>
  <ul class="file-grid">
    <li v-for="(file, i) in fileList" :key="i" class="file-grid__item">
      <div class="file-grid__item-meta">
        <div class="file-grid__item-meta--inner">
          <v-icon size="64" color="primary">{{ file.icon }}</v-icon>
          <p>{{ file.originalName }}</p>
        </div>
      </div>
      <a :href="file.url" target="_blank">
        <button class="file-grid__item-button primary--text">Open file</button>
      </a>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'FileGrid',
    props: {
      files: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      fileList() {
        return this.files.map(file => {
          let icon = 'mdi-file';
          if (file.mimeType === 'application/pdf') {
            icon = 'mdi-file-pdf-box';
          } else if (file.mimeType.includes('image/')) {
            icon = 'mdi-file-image';
          }
          return {
            ...file,
            icon
          };
        })
      },
    },
    mounted() {
      console.log(this.$router);
      console.log(this.files);
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
