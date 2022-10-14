<template>
  <div>
    <h3>Versions:</h3>
    <div class="version-list">
      <v-list two-line>
        <v-list-item-group v-model="selectedIndex" mandatory>
          <template v-for="(version, i) in versions">
            <v-divider v-if="i" :key="i" />

            <v-list-item :key="`version-${i}`">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title v-text="version.updatedAt"></v-list-item-title>
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
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VersionSelector',
    props: {
      selectedVersion: {
        type: Object,
        required: true
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
    watch: {
      selectedIndex(index) {
        this.$emit('selection', this.versions[index].id);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
