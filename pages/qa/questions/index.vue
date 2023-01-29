<template>
  <div>
    <h1>Questions</h1>
    <v-btn color="primary" dark @click="createNew"> Create new </v-btn>

    <question-form :question="editingQuestion" :visible="questionFormVisible" @hide="hideQuestionForm" @created="questionCreated" />

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="$fetchState.pending"
        loading-text="Loading questions... Please wait"
        :headers="headers"
        :items="questions"
        :search="search"
        @click:row="questionRowClick"
      >
        <template #item.name="{ item }">
          <span @click.stop>
            <router-link :to="questionLink(item)">
              {{ item.name }}
            </router-link>
          </span>
        </template>

        <template #item.updatedAt="{ item }">
          <timestamp-at :timestamp="item.updatedAt" :user="item.updatedBy" />
        </template>

        <template #item.createdAt="{ item }">
          <timestamp-at :timestamp="item.createdAt" :user="item.createdBy" />
        </template>
        <template #item.actions="{ item }">
          <v-btn small outlined @click="editQuestion($event, item)">...</v-btn>
        </template>
      </v-data-table>
    </v-card>
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
        search: '',
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
        this.$router.push(this.questionLink(question));
      },
      questionLink(question) {
        return `${this.$route.path}/${question.id}`;
      },
      editQuestion(event, question) {
        event.stopPropagation();
        this.$set(this.$data, 'editingQuestion', question);
        this.showQuestionForm();
      }
    }
  };
</script>
