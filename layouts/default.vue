<template>
  <v-app dark>
    <v-app-bar fixed app :clipped-left="true"></v-app-bar>
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

  export default {
    name: 'DefaultLayout',
    components: {
      NavigationDrawer
    },
    data() {
      return {}
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
