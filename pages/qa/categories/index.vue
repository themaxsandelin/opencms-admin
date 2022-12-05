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

    <v-card class="mt-6" outlined>
      <v-card-title class="pt-0 pb-1">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="$fetchState.pending"
        loading-text="Loading categories... Please wait"
        :headers="headers"
        :items="categories"
        :search="search"
        @click:row="categoryRowClick"
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
          <v-btn small outlined @click="editCategory($event, item)">...</v-btn>
        </template>
      </v-data-table>
    </v-card>
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
        search: '',
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
        if (this.editingCategory) {
          this.$set(this.$data, 'editingCategory', null);
        }
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
