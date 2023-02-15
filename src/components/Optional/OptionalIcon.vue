<template>
  <font-awesome-icon
    icon="star"
    :class="['icon-star', optionals.includes(symbol) ? 'icon-star-on' : '']"
    @click.stop="handleAddOrCancelOptional(symbol)"
  />
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    symbol: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters({
      optionals: "getMyOptionals", // 自选
    }),
  },
  methods: {
    handleAddOrCancelOptional(symbol) {
      // 已屬於自選，取消自選
      if (this.optionals.includes(symbol)) {
        this.$store.dispatch("cancelMyOptionals", symbol).catch((res) => {
          this.$message({
            type: "error",
            message: res.msg,
          });
        });
      } else {
        // 添加自選
        this.$store.dispatch("addMyOptionals", symbol).catch((res) => {
          this.$message({
            type: "error",
            message: res.msg,
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scope>
.icon-star-on {
  color: #357ce1 !important;
}
</style>
