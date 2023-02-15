<template>
  <div class="current-order">
    <el-table :data="communityList" style="width: 100%">
      <el-table-column
        prop="inviteCode"
        :label="$t('community.table.label1')"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('community.table.label2')" align="center">
        <template slot-scope="scope">
          <p class="state-text">
            {{
              parseInt(scope.row.status) === 0
                ? `${$t('community.notUsed')}`
                : `${$t('community.used')}`
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('community.table.label3')" align="center">
        <template slot-scope="scope">
          <p class="state-text">
            {{ parseInt(scope.row.status) === 0 ? `` : scope.row.inviteUserId }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('community.table.label4')" align="center">
        <template slot-scope="scope">
          <p class="state-text">
            {{ parseInt(scope.row.status) === 0 ? `` : scope.row.amount }}
          </p>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <!-- <el-table-column :label="$t('otc.operate')">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handleBuyInviteCode(scope.row)">{{$t('community.details')}}</el-button>
              </template>
            </el-table-column> -->
    </el-table>
    <Pagination
      v-show="total > pageSize"
      @changePage="changeCommunityPage"
      :total="total"
      :currentPage="pageNo"
      :pageSize="pageSize"
    ></Pagination>
  </div>
</template>

<script>
export default {
  name: 'communityList',
  props: {
    communityList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    total: {
      type: Number,
      default: 1,
    },
    pageNo: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    changeCommunityPage(i) {
      this.$emit('changePage', i);
    },
    // handleBuyInviteCode(item) {
    //   this.$emit("buyInviteCode",item.userId)
    // }
  },
};
</script>

<style lang="scss" scope>
.redText {
  color: #e2214e;
}
.greenText {
  color: #00ad88;
}
</style>
