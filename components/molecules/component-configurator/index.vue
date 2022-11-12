<template>
  <div class="component-configurator">
    <p>{{ component.name }}</p>
    <div v-if="fields.length" class="component-configurator__form">
      <component
        :is="field.component"
        v-for="(field, i) in fields"
        :key="i"
        v-bind="field.props"
        :value="field.value"
        @update="fieldUpdate(field.key, $event)"
      />
    </div>

    <div class="component-configurator__actions">
      <v-btn :disabled="first" icon small @click="moveUp">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
      <v-btn :disabled="last" icon small @click="moveDown">
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
      <v-btn icon small color="red" @click="remove">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  // Components config
  import components from '@/config/components';

  // Field components
  const fieldComponents = {
    'select': () => import('@/components/molecules/select-field'),
    'reference': () => import('@/components/molecules/reference-field')
  };

  export default {
    name: 'ComponentConfigurator',
    props: {
      component: {
        type: Object,
        required: true
      },
      first: {
        type: Boolean,
        default: false
      },
      last: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      fields() {
        const componentConfig = components.find(component => component.key === this.component.key);
        if (!componentConfig) {
          return [];
        }
        if (!Object.prototype.hasOwnProperty.call(componentConfig, 'fields')) {
          return [];
        }

        return componentConfig.fields.map(field => ({
          ...field,
          component: Object.prototype.hasOwnProperty.call(fieldComponents, field.fieldType) ? fieldComponents[field.fieldType] : undefined,
          value: this.component && this.component.fieldData && Object.prototype.hasOwnProperty.call(this.component.fieldData, field.key) ? this.component.fieldData[field.key] : undefined
        })).filter(field => field.component !== null);
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
      },
      fieldUpdate(fieldKey, data) {
        this.$emit('update', { fieldKey, data });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
