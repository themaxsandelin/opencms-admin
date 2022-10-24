<template>
  <div>
    <v-divider />
    <v-list two-line>
      <v-list-item-group v-model="selectedIndex">
        <template v-for="(component, i) in components">
          <v-divider v-if="i" :key="i" />

          <v-list-item :key="component.key">
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title v-text="component.name"></v-list-item-title>
                <v-list-item-subtitle v-text="component.description"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-divider />
  </div>
</template>

<script>
  export default {
    name: 'ComponentSelectionList',
    props: {
      selected: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        selectedIndex: null,
        components: [
          {
            name: 'Question detail',
            description: 'The question detail component',
            key: 'question-detail'
          },
          {
            name: 'Similar questions list',
            description: 'A list of similar questions',
            key: 'similar-questions-list'
          },
          {
            name: 'Question category lineup',
            description: 'A linup of all question categories',
            key: 'question-category-lineup'
          },
          {
            name: 'Question list',
            description: 'A list of questions based on certain criteria',
            key: 'question-list'
          }
        ]
      };
    },
    watch: {
      selected() {
        if (this.selected) {
          const selectedComponentIndex = this.components.findIndex(component => component.key === this.selected.key);
          if (selectedComponentIndex > -1) {
            this.$set(this.$data, 'selectedIndex', selectedComponentIndex);
          }
        } else {
          this.$set(this.$data, 'selectedIndex', undefined);
        }
      },
      selectedIndex(index) {
        const isSelected = typeof index === 'number';
        this.$emit('selected', isSelected ? this.components[index] : null);
      }
    }
  };
</script>
