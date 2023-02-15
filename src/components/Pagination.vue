<template>
  <div class="pagination-container">
    <div class="total-record">
      共 {{ recordsTotal }} 条记录 第 {{ currentPage }} / {{ totalPages }} 页
    </div>
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="changePage"
      layout="prev, pager, next, sizes, jumper"
      :total="recordsTotal"
      :page-size="5"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    recordsTotal: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    totalPages() {
      return parseInt(this.recordsTotal / this.pageSize) + 1;
    },
  },
  methods: {
    // 改变每页显示条数
    handleSizeChange(i) {
      this.$emit("handleSizeChange", i);
    },
    // 分页查询
    changePage(i) {
      this.$emit("changePage", i);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  margin-top: 16px;
  height: 28px;
  line-height: 28px;
  .total-record {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.4274509803921);
    float: left;
  }
  .pagination {
    float: right;
  }
}
</style>
