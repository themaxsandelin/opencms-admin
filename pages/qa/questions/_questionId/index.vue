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

    <content-block-variant-form
      :block-id="$route.params.questionId"
      :visible="variantFormVisible"
      @hide="hideVariantForm"
      @created="variantCreated"
    />

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
  import ContentBlockVariantForm from '@/components/organisms/content-block-variant-form';
  import ContentBlockEditor from '@/components/organisms/content-block-editor';

  export default {
    name: 'QuestionPage',
    components: {
      ContentBlockVariantForm,
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
        await this.updateQuestion();
      }
      if (this.selectedVariant) {
        await this.updateVariant();
      }
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
        this.updateVariant();
      }
    },
    methods: {
      async updateQuestion() {
        const { data, error } = await this.$api(`/content-blocks/${this.$route.params.questionId}?type=question`);
        if (error) {
          console.error('Failed to fetch question', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load question.' });
        }
        this.$set(this.$data, 'question', data);
      },
      async updateVariant() {
        const { data, error } = await this.$api(`/content-blocks/${this.$route.params.questionId}/variants/${this.selectedVariant}`);
        if (error) {
          console.error('Failed to fetch question variant', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load variant.' });
        }
        this.$set(this.$data, 'variant', data);
      },
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
