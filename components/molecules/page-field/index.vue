<template>
  <div class="page-field">
    <label v-if="label">{{ label }}</label>
    <div class="page-field__selector">
      <p>{{ selectionText }}</p>
      <v-btn color="primary" :disabled="$fetchState.pending" @click="showPageSelector">{{ buttonText }}</v-btn>
    </div>

    <page-selector-modal
      :selected="selectedPage"
      :visible="pageModalVisible"
      @hide="hidePageSelector"
      @select="pageSelected"
    />
  </div>
</template>

<script>
  // Components
  import PageSelectorModal from '@/components/organisms/page-selector-modal';

  export default {
    name: 'PageField',
    components: {
      PageSelectorModal
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        pageModalVisible: false,
        selectedPage: null
      };
    },
    async fetch() {
      if (this.value) {
        const [,,id] = this.value.split(':').filter(Boolean);
        const { siteId } = this.$route.params;
        const { data, error } = await this.$api(`/sites/${siteId}/pages/${id}`);
        if (error) {
          console.error('Failed to load page field value by id', id, error);
          return this.$store.commit('alert/set', { type: 'error', message: error });
        }

        this.$set(this.$data, 'selectedPage', data);
      }
    },
    computed: {
      selectionText() {
        if (this.$fetchState.pending) {
          return 'Loading reference..';
        }
        return this.selectedPage ? this.selectedPage.name : 'No page selected';
      },
      buttonText() {
        return this.selectedPage ? 'Change page' : 'Select page';
      },
    },
    watch: {
      value() {
        this.$fetch();
      }
    },
    methods: {
      showPageSelector() {
        this.$set(this.$data, 'pageModalVisible', true);
      },
      hidePageSelector() {
        this.$set(this.$data, 'pageModalVisible', false);
      },
      pageSelected(data) {
        this.$set(this.$data, 'pageModalVisible', false);
        this.$set(this.$data, 'selectedPage', data[0]);
        this.$emit('update', `reference:page:${this.selectedPage.id}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style.scss"
</style>
