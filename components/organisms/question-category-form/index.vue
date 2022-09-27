<template>
  <v-dialog :value="visible" max-width="720px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new question category</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideForm">Close</v-btn>
        <v-btn color="primary" :loading="requestLoading" @click="attemptCreateCategory">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'QuestionCategoryForm',
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
          required: value => !!value || 'You have to give the category a name.',
        }
      };
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      async attemptCreateCategory() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the category a name.' });
        }

        const body = {
          name: this.name,
          type: 'question-category'
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
