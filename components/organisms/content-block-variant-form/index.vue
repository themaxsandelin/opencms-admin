<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideForm">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editing ? 'Update' : 'Create new'}} content block variant</span>
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
                  <v-expansion-panel-header v-slot="{ sitePanelOpen }">
                    <v-row no-gutters>
                      <v-col cols="4">Sites</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="sitePanelOpen">Select one or more sites</span>
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="6">{{ selectedSites.length ? `${selectedSites.length} selected` : 'None selected' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <select-site :selected="selectedSites" @selection-change="siteSelectionChange" @toggle-all-selected="toggleAllSelected" />
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
        <v-btn color="primary" :loading="requestLoading" @click="attemptSubmit">{{ editing ? 'Save changes' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // Components
  import SelectSite from '@/components/organisms/select-site';

  export default {
    name: 'ContentBlockVariantForm',
    components: {
      SelectSite
    },
    props: {
      blockId: {
        type: String,
        required: true
      },
      visible: {
        type: Boolean,
        default: false
      },
      editingVariant: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        name: '',
        requestLoading: false,
        validation: {
          required: value => !!value || 'You have to give the variant a name.',
        },
        selectedSites: []
      };
    },
    computed: {
      editing() {
        return this.editingVariant !== null;
      },
    },
    watch: {
      editingVariant() {
        if (this.editingVariant) {
          const { name, sites } = this.editingVariant;
          this.$set(this.$data, 'name', name);
          this.$set(this.$data, 'selectedSites', sites);
        } else {
          this.$set(this.$data, 'name', '');
          this.$set(this.$data, 'selectedSites', []);
        }
      }
    },
    methods: {
      hideForm() {
        this.$emit('hide');
      },
      siteSelectionChange({ value, item }) {
        if (value) {
          this.selectedSites.push(item);
        } else {
          const index = this.selectedSites.findIndex(site => site.id === item.id);
          this.selectedSites.splice(index, 1);
        }
      },
      toggleAllSelected({ value, items }) {
          if (value) {
            this.selectedSites = [...items];
          } else {
            this.selectedSites = [];
          }
      },
      async attemptSubmit() {
        if (!this.name) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to give the variant a name.' });
        }
        if (!this.selectedSites) {
          return this.$store.commit('alert/set', { type: 'error', message: 'You have to select at least 1 site to assign the variant to.' });
        }

        const body = {
          name: this.name,
          sites: this.selectedSites.map(site => site.id)
        };

        let uri = `/content-blocks/${this.blockId}/variants`;
        let method = 'POST';
        if (this.editingVariant) {
          uri += `/${this.editingVariant.id}`;
          method = 'PATCH';
        }
        this.$set(this.$data, 'requestLoading', true);
        const { error } = await this.$api(uri, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        this.$set(this.$data, 'requestLoading', false);

        if (error) {
          console.error(`Variant ${this.editing ? 'edit' : 'creation'} failed.`, error);
          return this.$store.commit('alert/set', { message: `Failed to ${this.editing ? 'update' : 'create'} content block variant.`, type: 'error' });
        }

        this.$store.commit('alert/set', { message: `Content block variant successfully ${this.editing ? 'edited' : 'created'}!`, type: 'success' });
        this.name = '';
        this.hideForm();
        if (this.editing) {
          this.$emit('updated');
        } else {
          this.$emit('created');
        }
      }
    }
  };
</script>
