<template>
  <div>
    <v-text-field v-model="name" label="Name" />
  </div>
</template>

<script>
  export default {
    name: 'QuestionCategoryEditor',
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
      const { name } = this.content;
      return {
        name
      };
    },
    watch: {
      content() {
        this.$set(this.$data, 'name', this.content.name);
      }
    },
    methods: {
      save() {
        return {
          name: this.name
        };
      }
    }
  };
</script>
