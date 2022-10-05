<template>
  <div>
    <v-subheader>Question</v-subheader>
    <h1>{{ question.name }}</h1>
    <v-row>
      <v-col cols="3">
        <v-select
          :items="variants"
          label="Select a variant.."
          :value="selectedVariant"
          @change="variantSelectionChange"
        />
      </v-col>
      <v-col cols="3">
        <v-btn color="primary" dark @click="showVariantForm">Create new variant</v-btn>
      </v-col>
    </v-row>

    <question-variant-form :visible="variantFormVisible" @hide="hideVariantForm" @created="variantCreated" />

    <v-divider></v-divider>

    <content-block-editor
      v-if="variant"
      :type="question.type"
      :block="question"
      :variant="variant"
      :version="variant.latestVersion"
    />
  </div>
</template>

<script>
  // Components
  import QuestionVariantForm from '@/components/organisms/question-variant-form';
  import ContentBlockEditor from '@/components/organisms/content-block-editor';

  export default {
    name: 'QuestionPage',
    components: {
      QuestionVariantForm,
      ContentBlockEditor
    },
    data() {
      return {
        question: {},
        variant: null,
        variantFormVisible: false
      };
    },
    async fetch() {
      if (!this.question.id || (this.question.id !== this.$route.params.questionId)) {
        const question = await this.$api(`/content-blocks/${this.$route.params.questionId}?type=question`);
        if (question.statusCode) {
          console.error('Failed to fetch question', question);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load question.' });
        }

        this.question = question;
      }
      if (this.selectedVariant) {
        const variant = await this.$api(`/content-blocks/${this.$route.params.questionId}/variants/${this.selectedVariant}`);
        if (variant.statusCode) {
          console.error('Failed to fetch question variant', variant);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load variant.' });
        }

        this.variant = variant;
      }
    },
    fetchKey() {
      return `question-${this.$route.params.questionId}${this.$route.query.variant ? `-variant-${this.$route.query.variant}` : ''}`
    },
    computed: {
      variants() {
        if (!this.question.variants) return [];

        return this.question.variants.map(variant => ({
          text: variant.name,
          value: variant.id
        }));
      },
      selectedVariant() {
        return this.$route.query.variant || '';
      }
    },
    watch: {
      selectedVariant() {
        this.$fetch();
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
      },
      variantSelectionChange(variantId) {
        this.$router.push({ query: { variant: variantId } });
      }
    }
  };
</script>
