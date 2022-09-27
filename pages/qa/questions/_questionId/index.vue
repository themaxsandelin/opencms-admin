<template>
  <div>
    <v-subheader>Question</v-subheader>
    <h1>{{ question.name }}</h1>
    <v-row>
      <v-col cols="3">
        <v-select
          :items="variants"
          label="Select a variant.."
        />
      </v-col>
      <v-col cols="3">
        <v-btn color="primary" dark @click="showVariantForm">Create new variant</v-btn>
      </v-col>
    </v-row>

    <question-variant-form :visible="variantFormVisible" @hide="hideVariantForm" @created="variantCreated" />

    <v-divider></v-divider>
  </div>
</template>

<script>
  // Components
  import QuestionVariantForm from '@/components/organisms/question-variant-form';

  export default {
    name: 'QuestionPage',
    components: {
      QuestionVariantForm
    },
    data() {
      return {
        question: {},
        variantFormVisible: false
      };
    },
    async fetch() {
      const question = await this.$api(`/content-blocks/${this.$route.params.questionId}?type=question`);
      if (question.statusCode) {
        return console.error('Failed to fetch question', question);
      }

      this.question = question;
    },
    computed: {
      variants() {
        if (!this.question.variants) return [];

        return this.question.variants.map(variant => ({
          text: variant.name,
          value: variant.id
        }));
      }
    },
    methods: {
      showVariantForm() {
        this.variantFormVisible = true;
      },
      hideVariantForm() {
        this.variantFormVisible = false;
      },
      variantCreated() {
        this.$fetch();
      }
    }
  };
</script>
