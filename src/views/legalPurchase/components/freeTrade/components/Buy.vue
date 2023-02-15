<template>
  <div class="free-trade-buy">
    <Header
      activeTab="buy"
      @selectPayways="selectPayway"
      @selectMoneyWay="selectMoneyWay"
    ></Header>
    <div class="box-context">
      <el-table :data="buyList" style="width: 100%">
        <!-- 广告方 -->
        <el-table-column :label="$t('otc.advertiser')" align="left">
          <template slot-scope="scope">
            <div class="adv-info">
              <img :src="scope.row.userLogo" alt="" class="adv-logo" />
              <span class="names">{{ scope.row.userName }}</span>
              <span class="orderNum">{{ scope.row.orderNum }}</span>
              <span class="divider"></span>
              <span class="rate">{{ scope.row.limitRate }}%</span>
            </div>
          </template>
        </el-table-column>
        <!-- 数量 -->
        <el-table-column prop="amount" :label="$t('otc.amount')">
          <template slot-scope="scope"> {{ scope.row.amount }} USDT </template>
        </el-table-column>
        <!-- 限额 -->
        <el-table-column :label="$t('otc.limit')">
          <template slot-scope="scope">
            <span class="mmtext"
              >{{ scope.row.minCny }} USDT- {{ scope.row.maxCny }} USDT</span
            >
          </template>
        </el-table-column>
        <!-- 单价 -->
        <el-table-column :label="$t('otc.price')">
          <template slot-scope="scope">
            <span class="price-text"
              >{{ scope.row.currencySign }}{{ scope.row.price }}</span
            >
          </template>
        </el-table-column>
        <!-- 支付方式 -->
        <el-table-column :label="$t('otc.payWay')" width="180">
          <template slot-scope="scope">
            <img
              v-show="scope.row.isPayAli == '1'"
              src="../../../../../assets/newIcons/zhifubao.png"
              class="pay-img"
            />
            <img
              v-show="scope.row.isPayWx == '1'"
              src="../../../../../assets/newIcons/weChat.png"
              class="pay-img"
            />
            <img
              v-show="scope.row.isPayBank == '1'"
              src="../../../../../assets/newIcons/bank.png"
              class="pay-img"
            />
          </template>
        </el-table-column>
        <!-- 0手续费 -->
        <el-table-column
          prop="date"
          :label="$t('otc.noneHandlingFee')"
          align="right"
          width="130"
        >
          <template slot-scope="scope">
            <el-button
              class="btn"
              @click="handleBuy(scope.$index, scope.row)"
              >{{ $t('otc.buy') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, next"
        :page-size="pageSize"
        :total="total"
        @prev-click="pagePrev"
        @next-click="pageNext"
        class="buy-list-pagination"
        :hide-on-single-page="true"
      ></el-pagination>
    </div>
    <NullRecord v-if="buyList.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <!-- 购买弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      class="showBuyDialog"
      @before-close="handleCloseDialog"
      :title="$t('otc.buy')"
      :visible.sync="showBuyDialog"
      width="1138px"
    >
      <div class="dialog-box">
        <div class="dialog-container">
          <div class="left">
            <div class="cos">
              <img :src="buyDes.userLogo" class="avta" />
              <span class="name-cos">{{ buyDes.userName }}</span>
              <span class="orderNum">{{ buyDes.orderNum }}</span>
              <span class="rate">{{ buyDes.limitRate }}%</span>
            </div>
            <ul class="pay-way">
              <li v-show="buyDes.isPayAli == '1'">
                <img
                  src="../../../../../assets/newIcons/zhifubao.png"
                  class="pay-img"
                />
                <span class="pay-tip">
                  <!-- 支付宝 -->
                  {{ $t('otc.alipay') }}
                </span>
              </li>
              <li v-show="buyDes.isPayWx == '1'">
                <img
                  src="../../../../../assets/newIcons/weChat.png"
                  class="pay-img"
                />
                <span class="pay-tip">
                  <!-- 微信 -->
                  {{ $t('otc.wechat') }}
                </span>
              </li>
              <li v-show="buyDes.isPayBank == '1'">
                <img
                  src="../../../../../assets/newIcons/bank.png"
                  class="pay-img"
                />
                <span class="pay-tip">
                  <!-- 银行卡 -->
                  {{ $t('otc.bankCard') }}
                </span>
              </li>
            </ul>
            <div class="buyer-tip">
              <div class="title">
                <img
                  src="../../../../../assets/newIcons/tips.png"
                  class="tip-img"
                />
                <span class="tip-title">
                  <!-- 卖家提示，交易前请仔细阅读以下内容 -->
                  {{ $t('otc.tipsBeforeBuy') }}
                </span>
              </div>
              <p class="tip-text" style="white-space: pre-wrap">
                {{ buyDes.content }}
              </p>
            </div>
          </div>
          <div class="right">
            <div class="buy-des">
              <div class="left">
                <p class="title">
                  <!-- 数量 -->
                  {{ $t('otc.amount') }}
                </p>
                <p class="des">{{ buyDes.amount }}USDT</p>
              </div>
              <div class="left">
                <p class="title">
                  <!-- 限额 -->
                  {{ $t('otc.limit') }}
                </p>
                <!-- <p class="des">{{$t('newCommon.text59')}}{{ buyDes.minCny }} ~ {{$t('newCommon.text59')}}{{ buyDes.maxCny }}</p> -->
                <p class="des">
                  {{ buyDes.minCny }}USDT ~ {{ buyDes.maxCny }}USDT
                </p>
              </div>
              <div class="rights">
                <p class="title">
                  <!-- 单价 -->
                  {{ $t('otc.price') }}
                </p>
                <p class="des">{{ buyDes.currencySign }}{{ buyDes.price }}</p>
              </div>
            </div>
            <div class="input-box">
              <!-- 请输入购买数量 -->
              <input
                class="els-input"
                @input="changePayNum"
                v-model="buyNum"
                :placeholder="$t('otc.inputBuyAmount')"
              />
              <span class="usdt">USDT</span>
              <span class="ll"></span>
              <span class="all-in" @click="handleBuyAll">
                <!-- 全部买入 -->
                {{ $t('otc.buyAll') }}
              </span>
            </div>
            <div class="tips">
              <p class="left">
                {{ $t('otc.limit') }}:
                <span class="left-des"
                  >{{ buyDes.minCny }}USDT ~ {{ buyDes.maxCny }}USDT</span
                >
              </p>
              <p class="rights">
                {{ $t('otc.actuallyPay') }}:
                <span class="right-des">{{ payNum }}</span>
              </p>
            </div>
            <div class="btn-box">
              <p class="time-btn">{{ timeLimit }}s</p>
              <p class="buy-btn" @click="enterBuy">
                {{ $t('otc.sureSubmit') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 头部组件
import Header from './Header.vue';
import { legalPurchaseApi } from '../../../../../server/axios.js';
export default {
  data() {
    return {
      // 购买订单列表
      pageNo: 1,
      filterPayWay: 0, //筛选支付方式：0全部，1支付宝，2微信，3银行卡
      filterCny: '',
      buyList: [],
      pageSize: 15,
      total: 0,
      buyDes: {},
      buyNum: 0,
      payNum: 0,
      // 是否显示购买的弹窗
      showBuyDialog: false,
      timeLimit: 300,
      payType: '',
    };
  },
  created() {
    this.getBaseData();
  },
  methods: {
    // 点击全部买入
    handleBuyAll() {
      this.buyNum = this.buyDes.amount;
      this.changePayNum();
    },
    // 获取数值
    getBaseData() {
      legalPurchaseApi
        .marketAdv(
          'buy',
          this.filterPayWay,
          this.filterCny,
          this.pageNo,
          'optional',
          this.payType
        )
        .then((res) => {
          if (res.code == 200) {
            this.buyList = res.data.data;
            this.total = Number(res.data.total);
          }
        });
    },
    // 上一页
    pagePrev() {
      let pageNo = this.pageNo - 1;
      this.pageNo = pageNo;
      this.getBaseData();
    },
    // 下一页
    pageNext() {
      let pageNo = this.pageNo + 1;
      this.pageNo = pageNo;
      this.getBaseData();
    },
    // 交易
    handleBuy(index, row) {
      this.showBuyDialog = true;
      this.buyDes = row;
      console.log('this.buyDes', this.buyDes);
      this.timeLimit = Number(this.buyDes.timeLimit);
      this.countDown();
    },
    // 关闭交易弹框
    handleCloseDialog() {
      clearTimeout(this.timer);
      this.timeLimit = 0;
      this.timer = null;
      this.showBuyDialog = false;
    },
    // 弹窗倒计时
    countDown() {
      if (this.timeLimit > 0) {
        this.timeLimit--;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        this.showBuyDialog = false;
      }
    },
    // 数量改变时，改变交易金额
    changePayNum() {
      this.payNum = this.round(this.buyDes.price * Number(this.buyNum), 2);
    },
    // 下单交易
    enterBuy() {
      // buySell, adId, amount, price
      if (!this.buyNum) {
        this.$message.error(this.$t('otc.inputBuyAmount'));
      } else {
        legalPurchaseApi
          .createOrder(
            'buy',
            this.buyDes.adId,
            this.buyNum,
            this.buyDes.price,
            ''
          )
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.timer = null;
              this.showBuyDialog = false;
              this.$router.push({
                path: '/legalPurchase/orderDetail/buy',
                query: { orderId: res.data.orderId },
              });
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    // header组件选择
    // 支付方式
    selectPayway(key, currencyType) {
      this.filterPayWay = key;
      this.payType = currencyType;
      this.getBaseData();
    },
    // 金额
    selectMoneyWay(num) {
      this.filterCny = num;
      this.getBaseData();
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  components: {
    Header,
  },
};
</script>

<style lang="scss" scope>
.free-trade-buy {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  font-size: 14px;
  .box-context {
    width: 1200px;
    margin: 0 auto;
    .buy-list-pagination {
      float: right;
      margin-top: 20px;
    }
  }
  .adv-info {
    .adv-logo {
      height: 23px;
      width: 23px;
      vertical-align: middle;
      border-radius: 50%;
    }
    .names {
      margin-left: 5px;
      color: #3d3a50;
      font-size: 14px;
    }
    .orderNum {
      font-size: 12px;
      color: #6175ae;
      margin-left: 11px;
    }
    .divider {
      border-left: 1px solid #9a9a9a;
      margin: 0 10px;
    }
    .rate {
      font-size: 12px;
      color: #6175ae;
    }
  }
  .price-text {
    color: #6175ae;
  }
  .payWay {
    display: inline-block;
  }
  .pay-img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
  .btn {
    width: 63px;
    height: 26px;
    background: #6175ae;
    color: white;
    text-align: center;
    line-height: 1px;
    font-size: 12px;
  }
  .page-change {
    margin-top: 37px;
    text-align: right;
  }
  // 弹窗
  .dialog-box {
    .dialog-container {
      width: 1086px;
      padding: 20px;
      /* box-shadow: -3px -3px 20px rgba(0, 0, 0, 0.16); */
      display: flex;
      background-color: white;
      .left {
        flex: 1;
        .cos {
          height: 23px;
          line-height: 23px;
          .avta {
            width: 23px;
            vertical-align: middle;
            border-radius: 50%;
          }
          .name-cos {
            margin-left: 12px;
            font-size: 14px;
            color: #3d3a50;
            width: 120px;
            overflow: hidden;
          }
          .orderNum {
            margin-left: 38px;
            font-size: 12px;
            color: #6175ae;
          }
          .rate {
            margin-left: 13px;
            padding-left: 13px;
            border-left: 1px solid #9a9a9a;
            font-size: 12px;
            color: #6175ae;
          }
        }
        .pay-way {
          margin-top: 30px;
          padding-left: 37px;
          li {
            display: inline-block;
            padding-right: 20px;
          }
          .pay-img {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            vertical-align: text-bottom;
          }
          .pay-tip {
            font-size: 12px;
            color: #3d3a50;
            margin-left: 5px;
          }
        }
        .buyer-tip {
          padding-left: 37px;
          margin-top: 25px;
          .title {
            .tip-img {
              width: 12px;
              padding-right: 3px;
            }
            .tip-title {
              font-size: 12px;
              color: #6175ae;
            }
          }
          .tip-text {
            font-size: 12px;
            color: #9a9a9a;
            line-height: 30px;
          }
        }
      }
      .right {
        width: 433px;
        border: 1px solid #e3e3e3;
        border-radius: 5px;
        padding: 15px 20px;
        .buy-des {
          display: flex;
          .left {
            flex: 1;
            .title {
              font-size: 12px;
              color: #9a9a9a;
            }
            .des {
              font-size: 12px;
              color: #3d3a50;
              margin-top: 5px;
            }
          }
          .rights {
            width: 80px;
            text-align: right;
            .title {
              font-size: 12px;
              color: #9a9a9a;
            }
            .des {
              font-size: 12px;
              color: #3d3a50;
              margin-top: 5px;
            }
          }
        }
        .input-box {
          margin-top: 30px;
          width: 388px;
          height: 35px;
          border: 1px solid #6175ae;
          border-radius: 5px;
          display: flex;
          line-height: 35px;
          .els-input {
            width: 272px;
            height: 32px;
            border: none;
            padding-left: 15px;
          }
          .usdt {
            font-size: 12px;
            color: #9a9a9a;
          }
          .ll {
            margin-top: 10.5px;
            margin-left: 10px;
            border-left: 1px solid #9a9a9a;
            height: 14px;
          }
          .all-in {
            font-size: 12px;
            color: #6175ae;
            cursor: pointer;
            padding-left: 10px;
          }
        }
        .tips {
          margin-top: 8px;
          display: flex;
          font-size: 12px;
          color: #9a9a9a;
          .right-des {
            font-size: 14px;
            color: #6175ae;
            font-weight: 500;
          }
        }
        .btn-box {
          margin-top: 35px;
          text-align: right;
          .time-btn {
            display: inline-block;
            width: 110px;
            height: 30px;
            background: #f7f7f7;
            color: #3d3a50;
            font-size: 12px;
            margin-right: 14px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
          }
          .buy-btn {
            display: inline-block;
            width: 110px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #6175ae;
            font-size: 12px;
            cursor: pointer;
            color: #ffffff;
          }
        }
      }
    }
  }
}
input {
  background: none;
  outline: none;
  border: none;
  font-size: 12px;
}
/* input:focus{   
	border:none;
} */
</style>
