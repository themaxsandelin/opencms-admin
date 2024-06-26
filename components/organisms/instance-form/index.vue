<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog" @keydown.esc="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editingInstance ? 'Update': 'Create new' }} page instance</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                label="Choose an instance language..."
                outlined
                required
                :items="localeList"
                :value="selectedLocale"
                :disabled="editingInstance"
                @change="localeChange"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="title" label="Title *" required></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="slug" label="Slug *" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-textarea v-model="description" label="Description" hint="Enter a description for the page."></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn v-if="editingInstance" color="error" plain @click="showDeleteDialog">Delete</v-btn>
        <v-btn color="primary" :loading="saveLoading" @click="submit">{{ editingInstance ? 'Save changes' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>

    <verify-action v-bind="deleteAction" @hide="hideDeleteDialog" @abort="hideDeleteDialog" @confirm="attemptDelete" />
  </v-dialog>
</template>

<script>
  // Components
  import VerifyAction from '@/components/organisms/verify-action';

  export default {
    name: 'InstanceForm',
    components: {
      VerifyAction,
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      instance: {
        type: Object,
        default: null
      },
      instances: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        title: '',
        slug: '',
        description: '',
        selectedLocale: '',
        saveLoading: false,
        locales: [],
        deleteAction: {
          visible: false,
          loading: false,
          type: 'warning',
          title: 'Delete page instance',
          text: 'You are about to delete this page instance, are you sure you want to do that?',
          cancelLabel: 'Abort',
          confirmLabel: 'Yes, delete it'
        },
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/locales');
      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }
      this.$set(this.$data, 'locales', data);
    },
    computed: {
      localeList() {
        return this.locales.filter(locale => !this.existingLocales.includes(locale.code)).map(locale => ({
          text: `${locale.code} - ${locale.name}`,
          value: locale.code
        }));
      },
      existingLocales() {
        return this.instances.filter(instance => this.instance ? instance.id !== this.instance.id : true).map(instance => instance.localeCode);
      },
      editingInstance() {
        return this.instance !== null;
      },
    },
    watch: {
      instance() {
        if (this.instance) {
          const { title, slug, description, localeCode } = this.instance;
          this.$set(this.$data, 'title', title);
          this.$set(this.$data, 'slug', slug);
          this.$set(this.$data, 'description', description);
          this.$set(this.$data, 'selectedLocale', localeCode);
        } else {
          this.$set(this.$data, 'title', '');
          this.$set(this.$data, 'slug', '');
          this.$set(this.$data, 'description', '');
          this.$set(this.$data, 'selectedLocale', '');
        }
      }
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      localeChange(localeCode) {
        this.$set(this.$data, 'selectedLocale', localeCode);
      },
      async submit() {
        if (!this.selectedLocale) {
          return this.$store.commit('alert/set', { message: `You have to assign the instance a locale.`, type: 'error' });
        }
        if (!this.title) {
          return this.$store.commit('alert/set', { message: `You have to give the instance a title.`, type: 'error' });
        }
        if (!this.slug) {
          return this.$store.commit('alert/set', { message: `You have to give the instance a slug.`, type: 'error' });
        }

        try {
          this.$set(this.$data, 'saveLoading', true);

          const { siteId, pageId } = this.$route.params;
          let method = 'POST';
          let uri = `/sites/${siteId}/pages/${pageId}/instances`;

          const body = {
            title: this.title,
            slug: this.slug,
            description: this.description,
          };
          if (!this.editingInstance) {
            body.localeCode = this.selectedLocale;
          } else if (this.editingInstance) {
            method = 'PATCH';
            uri += `/${this.instance.id}`;
          }

          const { error } = await this.$api(uri, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });

          this.$set(this.$data, 'saveLoading', false);

          if (error) {
            console.error(error);
            return this.$store.commit('alert/set', { message: error, type: 'error' });
          }

          this.$store.commit('alert/set', { message: `Instance successfully ${this.editingInstance ? 'updated' : 'created'}!`, type: 'success' });
          this.$set(this.$data, 'title', '');
          this.$set(this.$data, 'slug', '');
          this.$set(this.$data, 'description', '');
          this.$set(this.$data, 'selectedLocale', '');
          this.hideDialog();
          if (this.editingInstance) {
            this.$emit('updated');
          } else {
            this.$emit('created');
          }
        } catch (error) {
          this.$store.commit('alert/set', { message: error.message, type: 'error' });
        }
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
        const { error } = await this.$api(`/sites/${siteId}/pages/${pageId}/instances/${this.instance.id}`, {
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

        this.$store.commit('alert/set', { message: 'Page instance successfully deleted!', type: 'success' });
        this.$set(this.$data, 'name', '');
        this.hideDialog();
        this.$emit('deleted');
      }
    }
  }
</script>
