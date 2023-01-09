<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog" @keydown.esc="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add new locale</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <locale-options :code="code" @selection="localeOptionSelection" />
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn color="primary" @click="attemptCreate">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import LocaleOptions from '../../molecules/locale-options';

  export default {
    name: 'LocaleForm',
    components: {
      LocaleOptions,
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
        code: '',
        creationLoading: false,
        validation: {
          required: value => !!value || 'This field is required.',
        }
      };
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      localeOptionSelection(locale) {
        const { name, code } = locale;
        this.$set(this.$data, 'name', name);
        this.$set(this.$data, 'code', code);
      },
      async attemptCreate() {
        if (!this.name || !this.code) {
          return;
        }

        const body = { name: this.name, code: this.code };
        const { error } = await this.$api(`/locales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (error) {
          console.error('Failed to add new locale', error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'name', '');
        this.$set(this.$data, 'code', '');
        this.$emit('created');
      }
    }
  }
</script>
