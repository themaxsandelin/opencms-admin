<template>
  <div>
    <h1>Categories</h1>
    <v-btn color="primary" dark @click="showCategoryForm">
      Create new
    </v-btn>

    <question-category-form
      :category="editingCategory"
      :visible="categoryFormVisible"
      @hide="hideCategoryForm"
      @created="questionCategoryCreated"
    />

    <v-data-table
      :loading="$fetchState.pending"
      loading-text="Loading categories... Please wait"
      :headers="headers"
      :items="categories"
      @click:row="categoryRowClick"
    >
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ new Date(item.updatedAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editCategory($event, item)">
          Edit
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // Components
  import QuestionCategoryForm from '@/components/organisms/question-category-form';

  export default {
    name: 'QuestionCategories',
    components: {
      QuestionCategoryForm
    },
    data() {
      return {
        categoryFormVisible: false,
        categories: [],
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
            value: 'actions'
          }
        ],
        editingCategory: null
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/content-blocks?type=question-category');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: 'Failed to load content blocks by type question-category.' });
      }
      this.$set(this.$data, 'categories', data);
    },
    methods: {
      showCategoryForm() {
        this.categoryFormVisible = true;
      },
      hideCategoryForm() {
        this.categoryFormVisible = false;
      },
      questionCategoryCreated() {
        this.$fetch();
      },
      categoryRowClick(category) {
        this.$router.push({ path: `${this.$route.path}/${category.id}` });
      },
      editCategory(event, category) {
        event.stopPropagation();
        this.$set(this.$data, 'editingCategory', category);
        this.showCategoryForm();
      }
    }
  };
</script>
