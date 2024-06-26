<template>
  <div>
    <v-text-field v-model="localName" label="Name" placeholder="Give your new form a name..." />
    <v-layout column>
      <v-row>
        <v-col cols="12" sm="4" md="4" lg="4">
          <v-btn color="primary" :disabled="saveDisabled" @click="save">Save changes</v-btn>
        </v-col>
        <v-col v-if="editing && versions.length" cols="12" sm="4" md="4" lg="4">
          <version-selector :versions="versions" :selected-version="selectedVersion" @selection="versionSelection" />
        </v-col>
        <v-col v-if="editing && environmentList.length" cols="12" sm="4" md="4" lg="4">
          <v-select
            label="Publish"
            :items="environmentList"
            :value="selectedEnvironments"
            outlined
            chips
            multiple
            @change="publishChange"
            @blur="publish"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12">
          <form-configurator :settings="settings" @update="formSettingsUpdate" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12">
          <form-builder :fields="fields" @update="formFieldsUpdate" />
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
  // Components
  import FormConfigurator from '@/components/organisms/form-configurator';
  import FormBuilder from '@/components/organisms/form-builder';
  import VersionSelector from '@/components/molecules/version-selector';

  // Form fields
  import { fields } from '@/config/forms';

  export default {
    name: 'FormEditor',
    components: {
      FormConfigurator,
      FormBuilder,
      VersionSelector
    },
    props: {
      editing: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      versions: {
        type: Array,
        default: () => []
      },
      selectedVersion: {
        type: Object,
        default: null
      },
      publishingEnvironments: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        localName: this.name || '',
        localVersion: this.selectedVersion ? { ...this.selectedVersion } : this.getBaseVersionData(),
        publishToEnvironments: [],
      };
    },
    computed: {
      saveDisabled() {
        if (!this.selectedVersion) {
          return false;
        }
        if (!this.selectedVersion.config) {
          return false;
        }
        if (!this.selectedVersion.config.fields) {
          return false;
        }
        return !this.selectedVersion.config.fields.length;
      },
      environmentList() {
        return this.publishingEnvironments.map(environment => ({
          text: environment.name,
          value: environment.id,
          disabled: this.selectedEnvironments.includes(environment.id)
        }))
      },
      selectedEnvironments() {
        return this.selectedVersion && this.selectedVersion.publications ? this.selectedVersion.publications.map(publication => publication.environment.id) : [];
      },
      fields() {
        return this.localVersion.config.fields.map((field) => {
          const configField = fields.find(configField => configField.type === field.type);
          if (!configField) {
            return field;
          }
          return {
            ...configField,
            config: field.config
          };
        });
      },
      settings() {
        if (this.localVersion.config.settings) {
          return this.localVersion.config.settings;
        }
        return {
          sendToEmail: ''
        };
      },
    },
    watch: {
      name() {
        this.$set(this.$data, 'localName', this.name);
      },
      selectedVersion() {
        this.$set(this.$data, 'localVersion', this.selectedVersion || this.getBaseVersionData());
      }
    },
    methods: {
      getBaseVersionData() {
        return {
          config: {
            fields: []
          }
        };
      },
      formFieldsUpdate(fields) {
        this.$set(this.$data.localVersion.config, 'fields', fields);
      },
      formSettingsUpdate(settings) {
        this.$set(this.$data.localVersion.config, 'settings', settings);
      },
      versionSelection(versionId) {
        this.$emit('version-change', versionId);
      },
      publishChange(data) {
        this.$set(this.$data, 'publishToEnvironments', data);
      },
      save() {
        this.$emit('save', { name: this.localName, version: { ...this.localVersion } });
      },
      publish() {
        this.$emit('publish', this.publishToEnvironments);
      }
    }
  };
</script>
