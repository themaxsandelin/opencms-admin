<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script>
  export default {
    name: 'ArticleEditor',
    props: {
      content: {
        type: Object,
        default: () => ({
          blocks: []
        })
      }
    },
    data() {
      return {
        editor: null
      };
    },
    watch: {
      content() {
        this.editor.destroy();
        this.editor = this.$editor({
          id: 'editor',
          data: this.content
        });
      }
    },
    mounted() {
      this.editor = this.$editor({
        id: 'editor',
        data: this.content
      });
    },
    methods: {
      async save() {
        const { blocks } = await this.editor.save();
        return {
          blocks
        };
      }
    }
  };
</script>
