<template>
  <div class="layout-grid">
    <div v-if="loading" class="layouts-loading">
      <span>Loading layouts...</span>
      <v-progress-circular
        indeterminate
        size="24"
        width="3"
        color="secondary"
      />
    </div>

    <template v-else>
      <div v-if="!layouts.length" class="no-layouts">No layouts found. Use the button above to create the first page layout.</div>

      <div v-else class="layouts">
        <v-card
          v-for="(layout, i) in layouts"
          :key="i"
        >
          <v-card-title>{{ layout.name }}</v-card-title>
        </v-card>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'LayoutGrid',
  props: {
    layouts: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
  .layout-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .layouts-loading {
      background: #f2f2f2;
      border-radius: 4px;
      padding: 8px 16px;

      span {
        margin: 0 8px 0 0;
      }
    }

    .no-layouts {
      background: #f2f2f2;
      border-radius: 4px;
      padding: 8px 16px;
      border-left: 4px solid #bbb;
    }

    .layouts {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;
    }
  }
</style>
