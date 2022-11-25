<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <template v-if="alert.message">
      <div class="app-alert">
        <v-alert :type="alert.type" border="left" dismissible @input="alertInput">
          {{ alert.message }}
        </v-alert>
      </div>
    </template>
  </v-app>
</template>

<script>
  export default {
    name: 'BaseLayout',
    computed: {
      alert() {
        return this.$store.state.alert;
      }
    },
    methods: {
      alertInput() {
        this.$store.commit('alert/reset');
      }
    }
  };
</script>
