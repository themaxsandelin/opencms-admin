<template>
  <div>
    <v-menu>
      <template #activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> View Versions </v-btn>
      </template>
      <v-list two-line>
        <v-list-item-group v-model="selectedIndex" mandatory>
          <template v-for="(version, i) in versions">
            <v-divider v-if="i" :key="i" />

            <v-list-item :key="`version-${i}`">
              <template #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ new Date(version.updatedAt).toLocaleString() }}
                  </v-list-item-title>
                  <div v-if="version.publications.length" class="text-left">
                    <v-chip v-for="(publication, j) in version.publications" :key="j" color="success" text-color="white" small>{{ publication.environment.name }}</v-chip>
                  </div>
                  <div v-else-if="!version.publications.length && version.wasPublished" class="text-left">
                    <v-chip text-color="black" small>Previously published</v-chip>
                  </div>
                  <!-- <v-list-item-subtitle v-text="component.description"></v-list-item-subtitle> -->
                </v-list-item-content>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-chip v-if="unpublishedChanges" color="info" text-color="white"> Unpublished changes </v-chip>
  </div>
</template>

<script>
export default {
  name: 'VersionSelector',
  props: {
    selectedVersion: {
      type: Object,
      default: null
    },
    versions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: undefined
    };
  },
  computed: {
    unpublishedChanges() {
      return this.versions && this.versions.length > 0 && this.versions[0].publications.length === 0;
    }
  },
  watch: {
    selectedIndex(index) {
      if (typeof this.versions[index] !== 'undefined') {
        this.$emit('selection', this.versions[index].id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './style';
</style>
