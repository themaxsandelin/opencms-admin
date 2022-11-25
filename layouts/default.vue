<template>
  <v-app>
    <v-app-bar fixed app :clipped-left="true">
      <v-layout justify-space-between align-center>
        <h3>Open CMS</h3>

        <user-menu v-if="user" :user="user" />
      </v-layout>
    </v-app-bar>
    <NavigationDrawer />
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
  // Components
  import NavigationDrawer from '../components/organisms/navigation-drawer/index.vue';
  import UserMenu from '../components/molecules/user-menu';

  export default {
    name: 'DefaultLayout',
    components: {
      NavigationDrawer,
      UserMenu
    },
    data() {
      return {
        user: null
      };
    },
    async fetch() {
      const { data, error } = await this.$api('/users/me');
      if (error) {
        console.error('Failed to fetch logged in user', error);
        return this.$store.commit('alert/set', { type: 'error', message: error });
      }

      this.$set(this.$data, 'user', data);
    },
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
  }
</script>

<style lang="scss">
  .app-alert {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    padding: 0 16px;
  }
</style>
