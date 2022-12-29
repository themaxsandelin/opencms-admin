<template>
  <div class="array-field">
    <p v-if="name">{{ name }}</p>
    <div class="array-field__contents">
      <div v-if="items.length" class="item-list">
        <div v-for="(item, i) in items" :key="i" class="item-list__item">
          <div class="item-list__item-fields">
            <component
              :is="field.component"
              v-for="(field, j) in item.fields"
              :key="`${i}-${j}`"
              v-bind="field.props"
              :value="field.value"
              @update="fieldUpdate(i, field.key, $event)"
              @input="fieldUpdate(i, field.key, $event)"
            />
          </div>
          <div class="item-list__item-actions">
            <v-btn :disabled="!i" icon small @click="moveItem(i, 'up')">
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn :disabled="i === (items.length - 1)" icon small @click="moveItem(i, 'down')">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="removeItem(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-btn color="primary" @click="addItem">Add item</v-btn>
    </div>
  </div>
</template>

<script>
  // Utils
  import { convertStringToLocalizedValue } from '@/utils/fields';

  // Field components
  const fieldComponents = {
    'select': () => import('@/components/molecules/select-field'),
    'reference': () => import('@/components/molecules/reference-field'),
    'localized-text': () => import('@/components/molecules/localized-input'),
    'number': () => import('@/components/molecules/number-field'),
    'boolean': () => import('@/components/molecules/boolean-field'),
    'array': () => import('@/components/molecules/array-field'),
    'text': () => import('@/components/molecules/text-field')
  };

  export default {
    name: 'ArrayField',
    props: {
      name: {
        type: String,
        default: ''
      },
      fields: {
        type: Array,
        required: true
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        localValue: [...this.value],
      };
    },
    computed: {
      items() {
        return this.localValue.map(item => {
          return {
            ...item,
            fields: this.fields.map(field => {
              let value = item.fieldData && Object.prototype.hasOwnProperty.call(item.fieldData, field.key) ? item.fieldData[field.key] : undefined;
              if (field.type === 'localized-text') {
                if (value &&  typeof value !== 'object') {
                  value = convertStringToLocalizedValue(value);
                }
              }
              return {
                ...field,
                component: Object.prototype.hasOwnProperty.call(fieldComponents, field.type) ? fieldComponents[field.type] : undefined,
                value
              };
            })
          };
        });
      },
    },
    watch: {
      value() {
        this.$set(this.$data, 'localValue', [...this.value]);
      }
    },
    methods: {
      addItem() {
        const localValue = [...this.localValue];
        localValue.push({});
        this.$set(this.$data, 'localValue', localValue);
        this.$emit('update', localValue);
      },
      fieldUpdate(itemIndex, fieldKey, fieldValue) {
        const localValue = [...this.localValue];
        if (!localValue[itemIndex].fieldData) {
          localValue[itemIndex].fieldData = {};
        }
        localValue[itemIndex].fieldData[fieldKey] = fieldValue;
        this.$set(this.$data, 'localValue', localValue);
        this.$emit('update', localValue);
      },
      generateTemporaryId() {
        let id = `${new Date().getTime()}`;
        for (let i = 0; i < 10; i++) {
          const number = Math.floor(Math.random() * (25 - 0 + 1) + 0);
          const character = String.fromCharCode(65 + number);
          id += character;
        }
        return id.split('').sort(() => 0.5 - Math.random()).join('');
      },
      moveItem(index, direction) {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === (this.localValue.length - 1)) return;

        const newIndex = index + (direction === 'up' ? -1 : 1);
        const localValue = [...this.localValue];
        const [item] = localValue.splice(index, 1);
        localValue.splice(newIndex, 0, item);
        this.$set(this.$data, 'localValue', localValue);
        this.$emit('updated', this.localValue);
      },
      removeItem(itemIndex) {
        const localValue = [...this.localValue];
        localValue.splice(itemIndex, 1);
        this.$set(this.$data, 'localValue', localValue);
        this.$emit('update', this.localValue);
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
