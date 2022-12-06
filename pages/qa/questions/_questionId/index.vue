<template>
  <div>
    <v-subheader>Question</v-subheader>
    <h1>{{ question.name }}</h1>
    <v-layout column wrap>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="variantList"
            label="Select a variant.."
            :value="selectedVariant"
            @change="variantSelectionChange"
          />
        </v-col>
        <v-col cols="9">
          <div class="variant-actions">
            <v-btn color="primary" dark @click="showVariantForm">Create new variant</v-btn>
            <v-btn v-if="selectedVariant" @click="editSelectedVariant">Edit variant</v-btn>
          </div>
        </v-col>
      </v-row>
      <content-block-editor
        v-if="variant"
        :type="question.type"
        :block="question"
        :variant="variant"
        :version="variant.latestVersion"
      />
    </v-layout>

    <content-block-variant-form
      :block-id="$route.params.questionId"
      :visible="variantFormVisible"
      :editing-variant="editingVariant"
      @hide="hideVariantForm"
      @created="variantUpdatedOrCreated"
      @updated="variantUpdatedOrCreated"
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
        variants: [],
        variant: null,
        variantFormVisible: false,
        editingVariant: null
      };
    },
    async fetch() {
      if (!this.question.id || (this.question.id !== this.$route.params.questionId)) {
        await this.updateQuestion();
      }
      if (!this.variants.length) {
        await this.updateVariants();
      }
      if (this.selectedVariant) {
        await this.updateVariant();
      }
    },
    computed: {
      variantList() {
        return this.variants.map(variant => ({
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
      async updateVariants() {
        const { data, error } = await this.$api(`/content-blocks/${this.$route.params.questionId}/variants`);
        if (error) {
          console.error('Failed to fetch question variants', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load variants.' });
        }
        this.$set(this.$data, 'variants', data);
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
        this.$set(this.$data, 'editingVariant', null);
      },
      variantUpdatedOrCreated() {
        this.updateQuestion();
        this.updateVariants();
      },
      variantSelectionChange(variantId) {
        this.$router.push({ query: { variant: variantId } });
      },
      editSelectedVariant() {
        this.$set(this.$data, 'editingVariant', this.variant);
        this.showVariantForm();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .variant-actions {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    button:not(:first-child) {
      margin-left: 16px;
    }
  }
</style>
