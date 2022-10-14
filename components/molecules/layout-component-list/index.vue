<template>
  <div class="layout-component-list">
    <component-configurator
      v-for="(component, i) in componentList"
      :key="i"
      :component="component"
      @moveUp="moveComponent('up', i)"
      @moveDown="moveComponent('down', i)"
      @delete="deleteComponent(i)"
    />
  </div>
</template>

<script>
  // Components
  import ComponentConfigurator from '@/components/molecules/component-configurator';

  export default {
    name: 'LayoutComponentList',
    components: {
      ComponentConfigurator
    },
    props: {
      components: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        componentList: [...this.components]
      };
    },
    watch: {
      components() {
        const list = [...this.components];
        this.$set(this.$data, 'componentList', list);
      }
    },
    methods: {
      moveComponent(direction, index) {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === (this.componentList.length - 1)) return;

        const newIndex = index + (direction === 'up' ? -1 : 1);
        const list = [...this.componentList];
        const [item] = list.splice(index, 1);
        list.splice(newIndex, 0, item);
        this.$set(this.$data, 'componentList', list);
        this.$emit('updated', this.componentList);
      },
      deleteComponent(index) {
        const list = [...this.componentList];
        list.splice(index, 1);
        this.$set(this.$data, 'componentList', list);
        this.$emit('updated', this.componentList);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
