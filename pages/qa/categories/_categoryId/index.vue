<template>
  <div>
    <v-subheader>Category</v-subheader>

    <template v-if="fetchingInitialData">
      <p>Loading category...</p>
    </template>

    <template v-else>
      <h1>{{ category.name }}</h1>

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
        :block-id="$route.params.categoryId"
        :visible="variantFormVisible"
        @hide="hideVariantForm"
        @created="variantCreated"
      />

      <content-block-editor
        v-if="variant"
        :type="category.type"
        :block="category"
        :variant="variant"
        :version="variant.latestVersion"
      />
    </template>
  </div>
</template>

<script>
  // Components
  import ContentBlockVariantForm from '@/components/organisms/content-block-variant-form';
  import ContentBlockEditor from '@/components/organisms/content-block-editor';

  export default {
    name: 'CategoryPage',
    components: {
      ContentBlockVariantForm,
      ContentBlockEditor
    },
    data() {
      return {
        fetchingInitialData: true,
        category: {},
        variant: null,
        variantFormVisible: false
      };
    },
    async fetch() {
      if (!this.category.id) {
        await this.updateCategory();
        this.fetchingInitialData = false;
      }
      if (this.selectedVariant) {
        await this.updateVariant();
      }
    },
    computed: {
      variants() {
        if (!this.category.variants) return [];

        return this.category.variants.map(variant => ({
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
      async updateCategory() {
        const { data, error } = await this.$api(`/content-blocks/${this.$route.params.categoryId}?type=question-category`);
        if (error) {
          console.error('Failed to fetch category', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load category.' });
        }
        this.$set(this.$data, 'category', data);
      },
      async updateVariant() {
        const { data, error } = await this.$api(`/content-blocks/${this.$route.params.categoryId}/variants/${this.selectedVariant}`);
        if (error) {
          console.error('Failed to fetch question variant', error);
          return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load variant.' });
        }
        this.$set(this.$data, 'variant', data);
      },
      variantSelectionChange(variantId) {
        this.$router.push({ query: { variant: variantId } });
      },
      showVariantForm() {
        this.variantFormVisible = true;
      },
      hideVariantForm() {
        this.variantFormVisible = false;
      },
      variantCreated() {
        this.updateCategory();
      }
    }
  };
</script>
