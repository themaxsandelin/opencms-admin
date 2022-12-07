<template>
  <div class="table-pagination">
    <button v-if="last > 1" class="table-pagination__button" :disabled="current === 1" @click="$emit('page', current - 1)">Prev</button>
    <button :class="['table-pagination__number-button', { 'table-pagination__number-button--selected': current === 1 }]" @click="$emit('page', 1)">1</button>

    <div class="table-pagination__number-buttons-wrapper">
      <button
        v-for="(number, index) in numberButtons"
        :key="index"
        :class="['table-pagination__number-button', { 'table-pagination__number-button--selected': number === current }]"
        @click="$emit('page', number)"
      >
        {{ number }}
      </button>
    </div>

    <button v-if="last >= 5" :class="['table-pagination__number-button', { 'table-pagination__number-button--selected': current === last }]" @click="$emit('page', last)">{{ last }}</button>
    <button v-if="last > 1" class="table-pagination__button" :disabled="current === last" @click="$emit('page', current + 1)">Next</button>
  </div>
</template>

<script>
  export default {
    name: 'TablePagination',
    props: {
      current: {
        type: Number,
        required: true
      },
      last: {
        type: Number,
        required: true
      }
    },
    computed: {
      numberButtons() {
        const buttons = [];
        if (this.last > 1) {
          if (this.current === 1) {
            buttons.push(this.current + 1, this.current + 2, this.current + 3);
          } else if (this.current > 1 && this.current < this.last) {
            if ((this.last - this.current) === 1) {
              buttons.push(this.current - 2);
            }
            if (this.current > 2) {
              buttons.push(this.current - 1);
            }
            buttons.push(this.current);
            if ((this.last - this.current) > 1) {
              buttons.push(this.current + 1);
            }
            if (this.current === 2) {
              buttons.push(this.current + 2);
            }
          } else if (this.current === this.last) {
            buttons.push(this.current - 3, this.current - 2, this.current - 1);
          }
        }
        return buttons;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
