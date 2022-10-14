<template>
  <div class="component-configurator">
    <p>{{ component.name }}</p>
    <v-btn icon small @click="moveUp">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn icon small @click="moveDown">
      <v-icon>mdi-arrow-down</v-icon>
    </v-btn>
    <v-btn icon small color="red" @click="remove">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'ComponentConfigurator',
    props: {
      component: {
        type: Object,
        required: true
      }
    },
    methods: {
      moveUp() {
        this.$emit('moveUp');
      },
      moveDown() {
        this.$emit('moveDown');
      },
      remove() {
        this.$emit('delete');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
