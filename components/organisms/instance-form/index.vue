<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new page instance</span>
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
        <v-btn color="primary" @click="attemptCreate">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'InstanceForm',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '',
        slug: '',
        description: '',
        selectedLocale: '',
        creationLoading: false,
        locales: []
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
        return this.locales.map(locale => ({
          text: `${locale.code} - ${locale.name}`,
          value: locale.code
        }));
      },
    },
    methods: {
      hideDialog() {
        this.$emit('hide');
      },
      localeChange(localeCode) {
        this.$set(this.$data, 'selectedLocale', localeCode);
      },
      async attemptCreate() {
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
          const { siteId, pageId } = this.$route.params;
          const body = {
            title: this.title,
            slug: this.slug,
            description: this.description,
            localeCode: this.selectedLocale
          };

          const { error } = await this.$api(`/sites/${siteId}/pages/${pageId}/instances`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });

          if (error) {
            console.error(error);
            return this.$store.commit('alert/set', { message: error, type: 'error' });
          }

          this.$store.commit('alert/set', { message: 'Instance successfully created!', type: 'success' });
          this.$set(this.$data, 'title', '');
          this.$set(this.$data, 'slug', '');
          this.$set(this.$data, 'description', '');
          this.hideDialog();
          this.$emit('created');
        } catch (error) {
          this.$store.commit('alert/set', { message: error.message, type: 'error' });
        }
      }
    }
  }
</script>
