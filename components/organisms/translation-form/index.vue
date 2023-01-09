<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog" @keydown.esc="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editing ? 'Update' : 'Add new' }} translation</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="key" label="Key *" required :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <localized-input :value="value" @input="valueInput" />
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn v-if="editing" color="error" plain @click="showDeleteDialog">Delete</v-btn>
        <v-btn color="primary" @click="attemptSubmit">{{ editing ? 'Save changes' : 'Submit' }}</v-btn>
      </v-card-actions>
    </v-card>

    <verify-action v-bind="deleteAction" @hide="hideDeleteDialog" @abort="hideDeleteDialog" @confirm="attemptDelete" />
  </v-dialog>
</template>

<script>
  // Components
  import LocalizedInput from '@/components/molecules/localized-input';
  import VerifyAction from '@/components/organisms/verify-action';

  // Utils
  import { getLocalizedInputDefaultValue } from '@/utils/fields';

  export default {
    name: 'TranslationForm',
    components: {
      LocalizedInput,
      VerifyAction
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      translation: {
        type: Object,
        default: null
      }
    },
    data() {
      const value = this.translation ? this.translation.value : getLocalizedInputDefaultValue();

      return {
        key: '',
        value,
        creationLoading: false,
        validation: {
          required: value => !!value || 'This field is required.',
        },
        deleteAction: {
          visible: false,
          loading: false,
          type: 'warning',
          title: 'Delete translation',
          text: 'You are about to delete this translation, are you sure you want to do that?',
          cancelLabel: 'Abort',
          confirmLabel: 'Yes, delete it'
        },
      };
    },
    computed: {
      editing() {
        return this.translation !== null;
      },
    },
    watch: {
      translation() {
        if (this.translation) {
          const { key, value } = this.translation;
          this.$set(this.$data, 'key', key);
          this.$set(this.$data, 'value', value);
        } else {
          this.$set(this.$data, 'key', '');
          this.$set(this.$data, 'value', getLocalizedInputDefaultValue());
        }
      }
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      valueInput(data) {
        this.$set(this.$data, 'value', data);
      },
      async attemptSubmit() {
        if (!this.key || !this.value) {
          return;
        }

        let uri = '/translations';
        let method = 'POST';
        if (this.editing) {
          uri += `/${this.translation.id}`;
          method = 'PATCH';
        }
        const body = { key: this.key, value: this.value };
        const { error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (error) {
          console.error(`Failed to ${this.editing ? 'update' : 'add new'} translation`, error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'key', '');
        this.$set(this.$data, 'value', getLocalizedInputDefaultValue());
        this.$emit(this.editing ? 'created' : 'updated');
      },
      showDeleteDialog() {
        this.$set(this.$data.deleteAction, 'visible', true);
      },
      hideDeleteDialog() {
        this.$set(this.$data.deleteAction, 'visible', false);
      },
      async attemptDelete() {
        this.$set(this.$data.deleteAction, 'loading', true);
        const { error } = await this.$api(`/translations/${this.translation.id}`, {
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

        this.$store.commit('alert/set', { message: 'Translation successfully deleted!', type: 'success' });
        this.$set(this.$data, 'key', '');
        this.$set(this.$data, 'value', getLocalizedInputDefaultValue());
        this.hideDialog();
        this.$emit('deleted');
      }
    }
  };
</script>
