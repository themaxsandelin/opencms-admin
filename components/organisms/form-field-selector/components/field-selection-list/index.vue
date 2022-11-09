<template>
  <div>
    <v-divider />
    <v-list two-line>
      <v-list-item-group v-model="selectedIndex">
        <template v-for="(field, i) in fields">
          <v-divider v-if="i" :key="i" />

          <v-list-item :key="field.type">
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title v-text="field.name"></v-list-item-title>
                <v-list-item-subtitle v-text="field.description"></v-list-item-subtitle>
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
  // Config
  import { fields } from '@/config/forms';

  export default {
    name: 'FieldSelectionList',
    props: {
      selected: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        selectedIndex: -1,
        fields
      };
    },
    watch: {
      selected() {
        if (this.selected) {
          const selectedIndex = this.fields.findIndex(field => field.type === this.selected.type);
          if (selectedIndex > -1) {
            this.$set(this.$data, 'selectedIndex', selectedIndex);
          }
        } else {
          this.$set(this.$data, 'selectedIndex', -1);
        }
      },
      selectedIndex(index) {
        const isSelected = typeof index === 'number';
        this.$emit('selected', isSelected ? this.fields[index] : null);
      }
    }
  };
</script>
