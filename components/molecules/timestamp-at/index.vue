<template>
  <span :title="localizedDate">
    {{ timestampAt }}

    by
    {{ fullName }}
  </span>
</template>

<script>
  export default {
    name: 'TimestampAt',
    props: {
      timestamp: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    computed: {
      localizedDate() {
        return new Date(this.timestamp).toLocaleString();
      },
      timestampAt() {
        const hours = Math.floor((new Date() - new Date(this.timestamp)) / 3600000);
        const days = Math.floor(hours / 24);
        console.log(days);
        if (days <= 1) {
          return new Intl.RelativeTimeFormat().format(-hours, 'hour');
        }

        if (days <= 10) {
          return new Intl.RelativeTimeFormat().format(-days, 'day');
        }
        if (days <= 28) {
          const weeks = Math.floor(days / 7);
          return new Intl.RelativeTimeFormat().format(-weeks, 'week');
        }
        if (days <= 365) {
          const months = Math.floor(days / 30.4);
          return new Intl.RelativeTimeFormat().format(-months, 'month');
        }
        return this.localizedDate;
      },
      fullName() {
        return this.user.firstName + ' ' + this.user.lastName;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import './style';
</style>
