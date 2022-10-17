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
        editor: null,
        editorInitializing: false,
        queueReinstantiation: false
      };
    },
    computed: {
      editorConfig() {
        return {
          id: 'editor',
          data: this.content,
          onReady: this.onEditorReady
        };
      }
    },
    watch: {
      content() {
        if (!this.editorInitializing) {
          this.reInstantiateEditor();
          return;
        }
        this.queueReinstantiation = true;
      },
      editorInitializing() {
        if (!this.editorInitializing && this.queueReinstantiation) {
          this.queueReinstantiation = false;
          this.reInstantiateEditor();
        }
      }
    },
    mounted() {
      this.instantiateEditor();
    },
    methods: {
      reInstantiateEditor() {
        if (this.editor && this.editor.destroy) {
          this.editor.destroy();
        }
        this.instantiateEditor();
      },
      instantiateEditor() {
        this.editorInitializing = true;
        this.editor = this.$editor(this.editorConfig);
      },
      onEditorReady() {
        this.editorInitializing = false;
      },
      async save() {
        const { blocks } = await this.editor.save();
        return {
          blocks
        };
      }
    }
  };
</script>
