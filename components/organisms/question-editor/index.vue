<template>
  <div>
    <v-text-field v-model="question" label="Question" />
    <article-editor ref="articleEditor" :content="answer" />
  </div>
</template>

<script>
  // Components
  import ArticleEditor from '@/components/organisms/article-editor';

  export default {
    name: 'QuestionEditor',
    components: {
      ArticleEditor
    },
    props: {
      content: {
        type: Object,
        default: () => ({
          question: '',
          answer: {
            blocks: []
          }
        })
      }
    },
    data() {
      const { question, answer } = this.content;
      return {
        question,
        answer
      };
    },
    watch: {
      content() {
        this.$set(this.$data, 'question', this.content.question);
        this.$set(this.$data, 'answer', this.content.answer);
      }
    },
    methods: {
      async save() {
        const articleContent = await this.$refs.articleEditor.save();
        return {
          question: this.question,
          answer: articleContent
        };
      }
    }
  };
</script>
