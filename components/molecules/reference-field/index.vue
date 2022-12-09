<template>
  <div class="reference-field">
    <label v-if="label">{{ label }}</label>
    <div class="reference-field__selector">
      <p>{{ selectionText }}</p>
      <v-btn color="primary" :disabled="$fetchState.pending" @click="showSelector">{{ buttonText }}</v-btn>
    </div>

    <reference-selector-modal
      :visible="modalVisible"
      :type="type"
      :content-block="contentBlock"
      :multiple="multiple"
      :selected="selected"
      @hide="hideSelector"
      @select="referenceSelected"
    />
  </div>
</template>

<script>
  // Components
  import ReferenceSelectorModal from '@/components/molecules/reference-selector-modal';

  export default {
    name: 'ReferenceField',
    components: {
      ReferenceSelectorModal
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        required: true
      },
      value: {
        type: String,
        default: ''
      },
      contentBlock: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        modalVisible: false,
        selected: []
      };
    },
    async fetch() {
      if (this.value) {
        const [,,ids] = this.value.split(':').filter(Boolean);
        const idList = ids.split(',');
        const selected = await Promise.all(
          idList.map(async (id) => {
            let uri = '';
            if (this.type === 'page') {
              const { siteId } = this.$route.params;
              uri = `/sites/${siteId}/pages/${id}`;
            } else if (this.type === 'form') {
              uri = `/forms/${id}`;
            } else if (this.type === 'content-block') {
              uri = `/content-blocks/${id}`;
            }

            if (!uri) {
              return console.error(`Could not fetch reference due to unknown type ${this.type}`);
            }

            const { data, error } = await this.$api(uri);
            if (error) {
              console.error(`Failed to load ${this.type} reference value by id ${id}`, error);
              this.$store.commit('alert/set', { type: 'error', message: error });
              return false;
            }

            return data;
          })
        );

        console.log('Selected', selected);
        this.$set(this.$data, 'selected', selected);
      }
    },
    computed: {
      selectionText() {
        if (this.$fetchState.pending) {
          return 'Loading reference..';
        }
        return this.selected.length ? this.selected.map(item => item.name).join(', ') : `No ${this.type} selected`;
      },
      buttonText() {
        return this.selected.length ? `Change ${this.type}` : `Select ${this.type}`;
      },
    },
    methods: {
      showSelector() {
        this.$set(this.$data, 'modalVisible', true);
      },
      hideSelector() {
        this.$set(this.$data, 'modalVisible', false);
      },
      referenceSelected(data) {
        this.hideSelector();
        this.$set(this.$data, 'selected', data);
        this.$emit('update', `reference:${this.type}:${this.selected.map(item => item.id).join(',')}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
