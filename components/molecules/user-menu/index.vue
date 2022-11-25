<template>
  <div class="user-menu">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <button class="user-menu__btn" v-bind="attrs" v-on="on">
          {{ user.firstName }}
          <v-avatar color="primary" size="40">{{ userNameAbbreviation }}</v-avatar>
        </button>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :href="item.href"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'UserMenu',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      items: [
        {
          title: 'Log out',
          href: '/auth/logout'
        }
      ]
    };
  },
  computed: {
    userNameAbbreviation() {
      return `${this.user.firstName.substring(0, 1)}${this.user.lastName.substring(0, 1)}`;
    }
  }
}
</script>

<style lang="scss">
  @import './style';
</style>
