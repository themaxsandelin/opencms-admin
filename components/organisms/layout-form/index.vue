<template>
  <v-dialog :value="visible" max-width="720px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new page layout</span>
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
        <v-btn color="primary" :loading="requestLoading" @click="attemptCreateLayout">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'LayoutForm',
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
          required: value => !!value || 'You have to give the layout a name.',
        }
      };
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      async attemptCreateLayout() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the layout a name.' });
        }

        const body = {
          name: this.name
        };

        this.requestLoading = true;
        const response = await this.$api(`/sites/${this.$route.params.siteKey}/pages/${this.$route.params.pageId}/layouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        this.requestLoading = false;

        if (response.statusCode) {
          console.error(response);
          return this.$store.commit('alert/set', { message: response.error || `Request failed. Status code ${response.statusCode}.`, type: 'error' });
        }

        this.$store.commit('alert/set', { message: 'Page layout successfully created!', type: 'success' });
        this.name = '';
        this.hideForm();
        this.$emit('created');
      }
    }
  };
</script>
