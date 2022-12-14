<template>
  <div>
    <v-text-field :value="localSettings.sendToEmail" type="email" label="Send submissions to:" placeholder="Enter the email adress to send submissions to..." outlined @input="updateSetting('sendToEmail', $event)" />
  </div>
</template>

<script>
  export default {
    name: 'FormConfigurator',
    props: {
      settings: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        localSettings: { ...this.settings }
      };
    },
    watch: {
      settings() {
        this.$set(this.$data, 'localSettings', this.settings);
      }
    },
    methods: {
      updateSetting(key, value) {
        const currentSettings = { ...this.localSettings };
        currentSettings[key] = value;
        this.$set(this.$data, 'localSettings', currentSettings);
        this.$emit('update', currentSettings);
      }
    }
  };
</script>
