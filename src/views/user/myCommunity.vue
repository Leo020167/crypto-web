<template>
  <div
    class="my-community-container"
    v-document-title
    :data-title="documentTitle"
  >
    <FadeComponent>
      <div class="main-container">
        <!-- 上层展示 -->
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="portrait" />
            <span class="title">{{ $t('header.my_community') }}</span>
          </p>
          <!-- 数据展示 -->
          <div class="top-data">
            <div class="left">
              <p class="upper-title">{{ $t('community.team_count') }}</p>
              <p class="upper-data">{{ communityObj.teamCount }}</p>
              <p class="lower-title">{{ $t('community.shequzongjiangli') }}</p>
              <p class="last-data">{{ communityObj.sumAmount }}</p>
            </div>
            <div class="center">
              <p class="lower-title mt">{{ $t('community.invite_count') }}</p>
              <p class="last-data">{{ communityObj.inviteCount }}</p>
            </div>
            <div class="right">
              <el-button type="primary" @click="handleBuyInviteCode">{{
                $t('community.details')
              }}</el-button>
            </div>
          </div>
        </div>
        <!-- 下层：记录展示 -->
        <div class="bottom">
          <div class="show-container" v-loading="recordShow">
            <!-- 社区记录 -->
            <community-list
              @changePage="changeCommunityPage"
              :communityList="communityList"
              :total="total"
              :pageNo="pageNo"
              :pageSize="pageSize"
            ></community-list>
          </div>
        </div>
        <!-- 弹窗 -->
        <BuyInviteCodeDialog
          v-if="isShowBuyInviteCode"
          :show-dialog="isShowBuyInviteCode"
          @closeBuyInviteCode="closeBuyInviteCode"
          @confirmBuyInviteCode="confirmBuyInviteCode"
          :inviteCodePrice="communityObj.inviteCodePrice"
        />
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import communityList from './compotents/communityList.vue'; // 邀请码列表
import BuyInviteCodeDialog from './compotents/buyInviteCodeDialog.vue'; // 购买邀请码弹窗
import { assetsApi } from '@/server/axios.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      currentTabNumber: 0,
      pageNo: 1, //记录公用标签
      pageSize: 10,
      total: 0,
      //数据
      communityList: [], //邀请码列表
      isShowBuyInviteCode: false, //是否展示购买邀请码弹窗
      communityObj: {
        teamCount: 0,
        inviteCount: 0,
        sumAmount: 0,
        inviteCodePrice: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      balanceInfosVuex: 'getBalanceInfos',
    }),
    documentTitle() {
      return this.getTitleValueByLang(
        '余额账户',
        '餘額賬戶',
        'Balance Account'
      );
    },
  },
  created() {
    this.recordShow = true;
    // 判断是否有指定特定的tab

    this.getInviteListData();
  },
  methods: {
    // 提币弹窗
    showBuyInviteCode() {
      this.dialogState = -1;
      this.getChainDetailData();
    },
    closeBuyInviteCode() {
      this.isShowBuyInviteCode = false;
    },
    // 获取充币、提币信息
    getInviteListData() {
      let self = this;
      assetsApi.getInviteList(self.pageNo).then((res) => {
        self.recordShow = false;
        if (res.code === '200') {
          self.communityList = res.data.inviteList;
          self.communityObj.teamCount = res.data.teamCount;
          self.communityObj.inviteCount = res.data.inviteCount;
          self.communityObj.sumAmount = res.data.sumAmount;
          self.communityObj.inviteCodePrice = parseFloat(
            res.data.inviteCodePrice
          );

          // self.total = Number(res.data.inviteCount)
          // self.pageSize = Number(15)
          // console.log(self.total, "self.total", self.pageSize, "self.pageSize")
        }
      });
    },
    // 法币记录，关闭loading
    showLoading() {
      this.recordShow = false;
    },
    // 跳转到法币购买页面
    goOtcPage() {
      this.$router.push('/legalPurchase');
    },
    // 修改社区的页码
    changeCommunityPage(i) {
      this.pageNo = i;
      this.getInviteListData();
    },
    // 显示购买邀请码弹窗
    handleBuyInviteCode() {
      this.isShowBuyInviteCode = true;
    },
    confirmBuyInviteCode(count) {
      console.log('confirmBuyInviteCode', count);
      let self = this;
      assetsApi.getInviteBuy(count).then((res) => {
        if (res.code === '200') {
          self.$message.success(res.msg);
          setTimeout(() => {
            self.isShowBuyInviteCode = false;
            self.getInviteListData();
          }, 400);
        } else {
          self.$message({
            type: 'error',
            message: res.msg,
          });
        }
      });
    },
  },
  components: {
    communityList,
    BuyInviteCodeDialog,
  },
};
</script>

<style lang="scss" scope>
.my-community-container {
  width: 100%;
  height: auto;
  background-color: $globalBg;
  color: $globalTextColor;
  padding-top: 2px;
  .main-container {
    width: 96%;
    margin: 0 auto;
    background-color: $globalBg;
    .top {
      margin-top: 10px;
      background-color: white;
      border-radius: 2px;
      padding: 10px 20px 22px;
      .top-title {
        line-height: 30px;
        display: flex;
        .portrait {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          display: inline-block;
        }
        .title {
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
      }
      .top-data {
        margin-top: 15px;
        display: flex;
        .left,
        .center {
          .upper-title {
            font-size: 14px;
            color: #8b8996;
          }
          .upper-data {
            font-size: 14px;
            margin-top: 12px;
            .transfor-usdt {
              margin-left: 12px;
              font-size: 12px;
              color: #9e9ca7;
            }
          }
          .lower-title {
            margin-top: 26px;
            font-size: 13px;
            color: #8b8996;
            &.mt {
              margin-top: 65px;
            }
          }
          .last-data {
            margin-top: 12px;
            font-size: 13px;
          }
        }
        .center {
          margin-left: 15px;
          width: 250px;
          text-align: right;
        }
        .right {
          margin-top: 20px;
          flex: 1;
          padding-right: 20px;
          text-align: right;
          .btns {
            margin-left: 10px;
          }
        }
      }
    }
    .bottom {
      margin-top: 20px;
      background-color: white;
      border-radius: 2px;
      padding: 15px 20px 20px;
      min-height: 400px;
      .bul {
        display: flex;
        li {
          margin-right: 24px;
          font-size: 15px;
          padding-bottom: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .actTab {
          color: #409efe;
          border-bottom: 2px solid #409efe;
        }
      }
      .show-container {
        margin-top: 10px;
      }
    }
  }
}
</style>
