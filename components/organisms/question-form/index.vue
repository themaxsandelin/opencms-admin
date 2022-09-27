<template>
  <v-dialog :value="visible" max-width="720px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new question</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ categoryPanelOpen }">
                    <v-row no-gutters>
                      <v-col cols="4">Question categories</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="categoryPanelOpen">Select one or more categories</span>
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="6">{{ selectedCategories.length ? `${selectedCategories.length} selected` : 'None selected' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <select-question-category @update="selectedCategoriesUpdated" />
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
        <v-btn color="primary" :loading="requestLoading" @click="attemptCreateQuestion">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import SelectQuestionCategory from '@/components/organisms/select-question-category';

  export default {
    name: 'QuestionForm',
    components: {
      SelectQuestionCategory
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: '',
        requestLoading: false,
        validation: {
          required: value => !!value || 'You have to give the question a name.',
        },
        selectedCategories: []
      };
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      selectedCategoriesUpdated(selectedCategories) {
        this.selectedCategories = selectedCategories;
      },
      async attemptCreateQuestion() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the question a name.' });
        }

        const body = {
          name: this.name,
          type: 'question',
          parentIds: this.selectedCategories.map(category => category.id)
        };

        this.requestLoading = true;
        const response = await this.$api('/content-blocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        this.requestLoading = false;

        if (response.statusCode) {
          console.error('Category creation failed.', response);
          return this.$store.commit('alert/set', { message: response.error || `Request failed. Status code ${response.statusCode}.`, type: 'error' });
        }

        this.$store.commit('alert/set', { message: 'Question category successfully created!', type: 'success' });
        this.name = '';
        this.hideForm();
        this.$emit('created');
      }
    }
  };
</script>
