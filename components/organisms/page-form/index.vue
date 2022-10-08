<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new page</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="title" label="Title *" required :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="slug" label="Slug *" hint="/example-slug" required :rules="[validation.required, validation.slug]"></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ pagePanelOpen }">
                    <v-row no-gutters>
                      <v-col cols="4">Parent page</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="pagePanelOpen">Select a parent page</span>
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="6">{{ parentPage ? parentPage.title : 'Not selected' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <select-page
                      :selected="selectedPages"
                      @selection="parentPageSelected"
                      @deselection="parentPageUnSelected"
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
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn color="primary" @click="attemptCreatePage">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// Components
import SelectPage from '@/components/organisms/select-page';

export default {
  name: 'PageForm',
  components: {
    SelectPage
  },
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
      selectedPages: [],
      showingSelectPageDialog: false,
      creationLoading: false,
      validation: {
        required: value => !!value || 'This field is required.',
        slug: value => {
          const pattern = /^\/([a-z0-9]?)+(?:-[a-z0-9]+)*$/;
          return pattern.test(value) || 'Invalid slug.';
        }
      }
    };
  },
  computed: {
    parentPage() {
      return this.selectedPages.length ? this.selectedPages[0] : null;
    }
  },
  methods: {
    showSelectPageDialog() {
      this.showingSelectPageDialog = true;
    },
    hideSelectPageDialog() {
      this.showingSelectPageDialog = false;
    },
    hideDialog() {
      this.$emit('hide');
    },
    parentPageSelected(page) {
      this.selectedPages = [page];
    },
    parentPageUnSelected() {
      this.selectedPages = [];
    },
    async attemptCreatePage() {
      if (!this.title || !this.slug) {
        this.$store.commit('alert/set', { message: `You have to give the page a ${!this.title ? 'title' : 'slug'}.`, type: 'error' });
        return;
      }

      try {
        const body = {
          title: this.title,
          slug: this.slug,
        };
        if (this.parentPage) {
          body.parentId = this.parentPage.id;
        }
        const { error } = await this.$api(`/sites/${this.$route.params.siteKey}/pages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { message: 'Failed to create the page.', type: 'error' });
        }

        this.$store.commit('alert/set', { message: 'Page successfully created!', type: 'success' });
        this.title = '';
        this.slug = '';
        this.parentPageUnSelected();
        this.hideDialog();
        this.$emit('created');
      } catch (error) {
        this.$store.commit('alert/set', { message: error.message, type: 'error' });
      }
    }
  }
}
</script>
