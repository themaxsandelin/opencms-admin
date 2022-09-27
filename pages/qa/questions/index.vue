<template>
  <div>
    <h1>Questions</h1>
    <v-btn color="primary" dark @click="showQuestionForm">
      Create new
    </v-btn>
    <question-form :visible="questionFormVisible" @hide="hideQuestionForm" @created="questionCreated" />
    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading questions... Please wait"
      :headers="headers"
      :items="questions"
      @click:row="questionRowClick"
    >
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // Components
  import QuestionForm from '@/components/organisms/question-form';

  export default {
    name: 'QuestionsPage',
    components: {
      QuestionForm
    },
    data() {
      return {
        questionFormVisible: false,
        questions: [],
        headers: [
          {
            text: 'Name',
            value: 'name',
            align: 'start'
          },
          {
            text: 'Last updated',
            value: 'updatedAt'
          },
          {
            text: 'Created',
            value: 'createdAt'
          }
        ]
      };
    },
    async fetch() {
      const questions = await this.$api('/content-blocks?type=question');
      if (questions.statusCode) {
        return console.error(questions);
      }

      this.questions = questions;
    },
    methods: {
      showQuestionForm() {
        this.questionFormVisible = true;
      },
      hideQuestionForm() {
        this.questionFormVisible = false;
      },
      questionCreated() {
        this.$fetch();
      },
      questionRowClick() {}
    }
  };
</script>
