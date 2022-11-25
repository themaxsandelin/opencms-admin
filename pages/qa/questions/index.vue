<template>
  <div>
    <h1>Questions</h1>
    <v-btn color="primary" dark @click="createNew">
      Create new
    </v-btn>

    <question-form
      :question="editingQuestion"
      :visible="questionFormVisible"
      @hide="hideQuestionForm"
      @created="questionCreated"
    />

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
      <template v-slot:item.updatedBy="{ item }">
        <span>{{ item.updatedBy.firstName }} {{ item.updatedBy.lastName }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdBy="{ item }">
        <span>{{ item.createdBy.firstName }} {{ item.createdBy.lastName }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editQuestion($event, item)">
          Edit
        </v-btn>
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
            text: 'Updated by',
            value: 'updatedBy'
          },
          {
            text: 'Created',
            value: 'createdAt'
          },
          {
            text: 'Created by',
            value: 'createdBy'
          },
          {
            text: '',
            value: 'actions',
            sortable: false
          }
        ],
        editingQuestion: null
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/content-blocks?type=question');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: 'Failed to fetch content blocks by type question.' });
      }

      this.$set(this.$data, 'questions', data);
    },
    methods: {
      createNew() {
        this.$set(this.$data, 'editingQuestion', null);
        this.showQuestionForm();
      },
      showQuestionForm() {
        this.questionFormVisible = true;
      },
      hideQuestionForm() {
        this.questionFormVisible = false;
      },
      questionCreated() {
        this.$fetch();
      },
      questionRowClick(question) {
        this.$router.push(`${this.$route.path}/${question.id}`);
      },
      editQuestion(event, question) {
        event.stopPropagation();
        this.$set(this.$data, 'editingQuestion', question);
        this.showQuestionForm();
      }
    }
  };
</script>
