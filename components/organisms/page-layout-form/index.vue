<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideForm" @keydown.esc="hideForm">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editing ? 'Update' : 'Create new'}} page layout</span>
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
        <v-btn v-if="editing" color="error" plain @click="showDeleteDialog">Delete</v-btn>
        <v-btn color="primary" :loading="updateRequestLoading" @click="attemptSubmit">{{ editing ? 'Save changes' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>

    <verify-action v-bind="deleteAction" @hide="hideDeleteDialog" @abort="hideDeleteDialog" @confirm="attemptDelete" />
  </v-dialog>
</template>

<script>
  // Components
  import VerifyAction from '@/components/organisms/verify-action';

  export default {
    name: 'PageLayoutForm',
    components: {
      VerifyAction
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      editingLayout: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        name: this.editingLayout ? this.editingLayout.name : '',
        updateRequestLoading: false,
        validation: {
          required: value => !!value || 'You have to give the layout a name.',
        },
        deleteAction: {
          visible: false,
          loading: false,
          type: 'warning',
          title: 'Delete page layout',
          text: 'You are about to delete this page layout, are you sure you want to do that?',
          cancelLabel: 'Abort',
          confirmLabel: 'Yes, delete it'
        },
      };
    },
    computed: {
      editing() {
        return this.editingLayout !== null;
      },
    },
    watch: {
      editingLayout() {
        if (this.editingLayout) {
          const { name } = this.editingLayout;
          this.$set(this.$data, 'name', name);
        } else {
          this.$set(this.$data, 'name', '');
        }
      }
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      async attemptSubmit() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the layout a name.' });
        }

        const { siteId, pageId } = this.$route.params;
        let method = 'POST';
        let uri = `/sites/${siteId}/pages/${pageId}/layouts`;
        const body = {
          name: this.name
        };
        if (this.editing) {
          method = 'PATCH';
          uri += `/${this.editingLayout.id}`;
        }

        this.$set(this.$data, 'updateRequestLoading', true);
        const { data, error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        this.$set(this.$data, 'updateRequestLoading', false);

        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { message: error, type: 'error' });
        }

        const emitLayoutId = this.editing ? this.editingLayout.id : data.id;

        this.$store.commit('alert/set', { message: `Page layout successfully ${this.editing ? 'updated' : 'created'}!`, type: 'success' });
        this.$set(this.$data, 'name', '');
        this.hideForm();
        this.$emit(this.editing ? 'updated' : 'created', emitLayoutId);
      },
      showDeleteDialog() {
        this.$set(this.$data.deleteAction, 'visible', true);
      },
      hideDeleteDialog() {
        this.$set(this.$data.deleteAction, 'visible', false);
      },
      async attemptDelete() {
        const { siteId, pageId } = this.$route.params;

        this.$set(this.$data.deleteAction, 'loading', true);
        const { error } = await this.$api(`/sites/${siteId}/pages/${pageId}/layouts/${this.editingLayout.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.$set(this.$data.deleteAction, 'loading', false);

        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { message: error, type: 'error' });
        }

        this.$store.commit('alert/set', { message: 'Page layout successfully deleted!', type: 'success' });
        this.$set(this.$data, 'name', '');
        this.hideForm();
        this.$emit('deleted');
      }
    }
  };
</script>
