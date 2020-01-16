<template>
  <nav class="pagination size-text" role="navigation" aria-label="pagination">
    <a class="pagination__previous" @click.prevent="changePage(1)" :disabled="pagination.current_page <= 1">начало</a>
    <a class="pagination__previous" @click.prevent="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1">назад</a>
    <ul class="pagination__list">
      <li v-for="(page, index) in pages" :key="index">
        <a class="pagination__link" :class="isCurrentPage(page) ? 'is-current' : ''" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
    </ul>
    <a class="pagination__next" @click.prevent="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page">вперед</a>
    <a class="pagination__next" @click.prevent="changePage(pagination.last_page)" :disabled="pagination.current_page >= pagination.last_page">конец</a>
  </nav>
</template>

<style>
  .pagination {
    margin-top: 40px;
  }
</style>

<script>
  export default {
    props: ['pagination', 'offset'],
    methods: {
      isCurrentPage(page) {
        return this.pagination.current_page === page;
      },
      changePage(page) {
        if (page > this.pagination.last_page) {
          page = this.pagination.last_page;
        }
        this.pagination.current_page = page;
        this.$emit('paginate');
      }
    },
    computed: {
      pages() {
        let pages = [];
        let from = this.pagination.current_page - Math.floor(this.offset / 2);
        if (from < 1) {
          from = 1;
        }
        let to = from + this.offset - 1;
        if (to > this.pagination.last_page) {
          to = this.pagination.last_page;
        }
        while (from <= to) {
          pages.push(from);
          from++;
        }
        return pages;
      }
    }
  }
</script>
