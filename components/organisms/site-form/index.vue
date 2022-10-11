<template>
  <v-dialog :value="visible" max-width="720px" @click:outside="hideDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Create new site</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="name" label="Name *" required :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="key" label="Key *" required :rules="[validation.required]"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates a required field</small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        <v-btn color="primary" @click="attemptCreateSite">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'SiteForm',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: '',
        key: '',
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
      async attemptCreateSite() {
        if (!this.name) {
          return this.$store.commit('alert/set', { message: `You have to give the site a name.`, type: 'error' });
        }
        if (!this.key) {
          return this.$store.commit('alert/set', { message: `You have to give the site a key.`, type: 'error' });
        }

        try {
          const body = {
            name: this.name,
            key: this.key
          };
          const { error } = await this.$api('/sites', {
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

          this.$store.commit('alert/set', { message: 'Site successfully created!', type: 'success' });
          this.$set(this.$data, 'name', '');
          this.$set(this.$data, 'key', '');
          this.hideDialog();
          this.$emit('created');
        } catch (error) {
          this.$store.commit('alert/set', { message: error.message, type: 'error' });
        }
      }
    }
  }
</script>
