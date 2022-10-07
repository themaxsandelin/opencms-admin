<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideForm">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ category ? 'Edit' : 'Create new' }} question category</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-expansion-panels v-model="panels">
                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ questionsPanelOpen }">
                    <v-row no-gutters>
                      <v-col cols="4">Child questions</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="questionsPanelOpen">Select one or more questions</span>
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="6">{{ selectedQuestions.length ? `${selectedQuestions.length} selected` : 'None selected' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <select-content-blocks
                      type="question"
                      :selected-ids="preSelectedIds"
                      @update="selectedQuestionsUpdated"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideForm">Close</v-btn>
        <v-btn color="primary" :loading="requestLoading" @click="submit">{{ category ? 'Save' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import SelectContentBlocks from '@/components/organisms/select-content-blocks';

  export default {
    name: 'QuestionCategoryForm',
    components: {
      SelectContentBlocks
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      category: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        panels: undefined,
        name: '',
        requestLoading: false,
        preSelectedIds: [],
        selectedQuestions: [],
        validation: {
          required: value => !!value || 'You have to give the category a name.',
        }
      };
    },
    watch: {
      category() {
        if (this.category) {
          const { name, children } = this.category;
          this.$set(this.$data, 'name', name);
          this.$set(this.$data, 'preSelectedIds', children.length ? children.map(child => child.id) : []);
          this.$set(this.$data, 'selectedQuestions', this.preSelectedIds);
        } else {
          this.$set(this.$data, 'name', '');
          this.$set(this.$data, 'selectedQuestions', []);
          this.$set(this.$data, 'preSelectedIds', []);
        }
        this.$set(this.$data, 'panels', undefined);
      }
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      selectedQuestionsUpdated(selectedQuestions) {
        this.$set(this.$data, 'selectedQuestions', selectedQuestions.map(question => question.id));
      },
      async submit() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the category a name.' });
        }

        let method = 'POST';
        let uri = '/content-blocks';
        const body = {
          name: this.name,
          childIds: this.selectedQuestions
        };
        if (this.category) {
          method = 'PATCH';
          uri += `/${this.category.id}`;
        } else {
          body.type = 'question-category';
        }

        this.requestLoading = true;
        const response = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        this.requestLoading = false;

        if (response.statusCode) {
          console.error(`Category ${this.category ? 'update' : 'creation'} failed.`, response);
          return this.$store.commit('alert/set', { message: response.error || `Request failed. Status code ${response.statusCode}.`, type: 'error' });
        }

        this.$store.commit('alert/set', { message: `Question category successfully ${this.category ? 'updated' : 'created'}!`, type: 'success' });
        this.$set(this.$data, 'name', '');
        this.$set(this.$data, 'preSelectedIds', []);
        this.$set(this.$data, 'selectedCategories', []);
        this.hideForm();
        this.$emit('created');
      }
    }
  };
</script>
