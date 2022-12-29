<template>
  <div>
    <localized-input :value="localSettings.sendToEmail" label="Send submissions to:" placeholder="Enter the email adress to send submissions to..." @input="updateSetting('sendToEmail', $event)" />
  </div>
</template>

<script>
  // Components
  import LocalizedInput from '@/components/molecules/localized-input';

  // Utils
  import { convertStringToLocalizedValue } from '@/utils/fields';

  export default {
    name: 'FormConfigurator',
    components: {
      LocalizedInput,
    },
    props: {
      settings: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        localSettings: this.mapSettings(this.settings)
      };
    },
    watch: {
      settings() {
        this.$set(this.$data, 'localSettings', this.mapSettings(this.settings));
      }
    },
    methods: {
      mapSettings(currentSettings) {
        return Object.keys(currentSettings).reduce((settings, key) => {
          if (key === 'sendToEmail' && typeof currentSettings[key] === 'string') {
            settings[key] = convertStringToLocalizedValue(currentSettings[key]);
            console.log(key, settings[key]);
          } else {
            settings[key] = currentSettings[key];
          }
          return settings;
        }, {});
      },
      updateSetting(key, value) {
        const currentSettings = { ...this.localSettings };
        currentSettings[key] = value;
        this.$set(this.$data, 'localSettings', currentSettings);
        this.$emit('update', currentSettings);
      }
    }
  };
</script>
