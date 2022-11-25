<template>
  <v-layout justify-center align-center>
    <v-card outlined max-width="344" class="mx-auto">
      <v-card-text class="text-center py-10 px-8">
        <h3>Open CMS</h3>
        <h1 class="text--primary mt-2">Login</h1>
        <p class="mt-4 mb-0">Click the login button below to log in with your Ellos AD account.</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout justify-center>
          <v-btn color="primary" @click="login">Log in with AD</v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    name: 'LoginPage',
    layout: 'base',
    computed: {
      error() {
        const { errorCode } = this.$route.query;
        return errorCode === 'invalid_client' ? 'The login client is misconfigured. Talk to system admin to fix this.' : 'Unkown login issue. Check system logs.';
      }
    },
    mounted() {
      if (this.$route.query.errorCode) {
        this.$store.commit('alert/set', { type: 'error', message: this.error });
      }
    },
    methods: {
      login() {
        window.location.href = `${window.location.origin}/auth/login`;
      }
    }
  };
</script>
