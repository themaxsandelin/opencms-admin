<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ page ? 'Update page' : 'Create new page' }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-checkbox v-model="isFrontPage" label="Set as the site front page"></v-checkbox>
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
                            <v-col cols="6">{{ parentPage ? parentPage.name : 'Not selected' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <select-page :selected="selectedPages" @selection="parentPageSelected" @deselection="parentPageUnSelected"/>
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
        <v-btn v-if="page" color="error" text :loading="deletionLoading" @click="attemptDeletePage">Delete</v-btn>
        <v-btn color="primary" :loading="actionLoading" @click="attemptCreatePage">{{ page ? 'Save' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>

    <verify-action
      v-bind="deleteDialog"
      @abort="abortDelete"
      @confirm="performDelete"
    />
  </v-dialog>
</template>

<script>
// Components
import SelectPage from '@/components/organisms/select-page';
import VerifyAction from '@/components/organisms/verify-action';

export default {
  name: 'PageForm',
  components: {
    SelectPage,
    VerifyAction
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      name: '',
      isFrontPage: false,
      selectedPages: [],
      showingSelectPageDialog: false,
      actionLoading: false,
      deletionLoading: false,
      validation: {
        required: value => !!value || 'This field is required.'
      },
      deleteDialog: {
        type: 'warning',
        title: 'You are about to delete a page',
        text: 'Just a heads up, you are about to delete a page. This will delete both the page, and the instances and the layouts in that page. Any child pages that might exist will be assigned as the children of this page\'s parent page, if there is one.',
        cancelLabel: 'Abort',
        confirmLabel: 'Delete',
        visible: false
      }
    };
  },
  computed: {
    parentPage() {
      return this.selectedPages.length ? this.selectedPages[0] : null;
    }
  },
  watch: {
    page() {
      if (this.page) {
        const { parent } = this.page;
        this.$set(this.$data, 'name', this.page.name);
        this.$set(this.$data, 'isFrontPage', this.page.isFrontPage);
        this.$set(this.$data, 'selectedPages', [parent]);
      } else {
        this.$set(this.$data, 'name', '');
        this.$set(this.$data, 'isFrontPage', false);
        this.$set(this.$data, 'selectedPages', []);
      }
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
      if (!this.name) {
        this.$store.commit('alert/set', { message: `You have to give the page a name.`, type: 'error' });
        return;
      }

      try {
        this.$set(this.$data, 'actionLoading', true);

        const { siteId } = this.$route.params;
        let method = 'POST';
        let uri = `/sites/${siteId}/pages`;
        const body = {
          name: this.name,
          isFrontPage: this.isFrontPage
        };
        if (this.parentPage) {
          body.parentId = this.parentPage.id;
        }
        if (this.page) {
          method = 'PATCH';
          uri += `/${this.page.id}`;
        }
        const { error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        this.$set(this.$data, 'actionLoading', false);

        if (error) {
          console.error(error);
          return this.$store.commit('alert/set', { message: error, type: 'error' });
        }

        this.$store.commit('alert/set', { message: `Page successfully ${this.page ? 'updated' : 'created'}!`, type: 'success' });
        this.$set(this.$data, 'name', '');
        this.$set(this.$data, 'isFrontPage', false);
        this.parentPageUnSelected();
        this.hideDialog();
        if (this.page) {
          this.$emit('updated');
        } else {
          this.$emit('created');
        }
      } catch (error) {
        this.$store.commit('alert/set', { message: error.message, type: 'error' });
      }
    },
    attemptDeletePage() {
      this.$set(this.$data.deleteDialog, 'visible', true);
    },
    abortDelete() {
      this.$set(this.$data.deleteDialog, 'visible', false);
    },
    async performDelete() {
      this.$set(this.$data.deleteDialog, 'visible', false);
      this.$set(this.$data, 'deletionLoading', true);

      const { siteId } = this.$route.params;
      const { error } = await this.$api(`/sites/${siteId}/pages/${this.page.id}`, {
        method: 'DELETE'
      });
      this.$set(this.$data, 'deletionLoading', false);

      if (error) {
        console.error(error);
        return this.$store.commit('alert/set', { message: error, type: 'error' });
      }

      this.$store.commit('alert/set', { message: 'Page successfully deleted!', type: 'success' });
      this.$set(this.$data, 'name', '');
      this.$set(this.$data, 'isFrontPage', false);
      this.parentPageUnSelected();
      this.hideDialog();
      this.$emit('deleted');
    }
  }
}
</script>
