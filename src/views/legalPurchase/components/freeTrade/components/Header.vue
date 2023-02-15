<template>
  <div class="free-trade-header">
    <div class="header-left">
      <span :class="[activeTab == 'buy' ? 'activeTab' : '', 'header-tab']">
        <router-link to="/legalPurchase/freeTrade/buy">{{
          $t('otc.buy')
        }}</router-link>
      </span>
      <span class="header-divider">|</span>
      <span :class="[activeTab == 'sell' ? 'activeTab' : '', 'header-tab']">
        <router-link to="/legalPurchase/freeTrade/sell">{{
          $t('otc.sell')
        }}</router-link>
      </span>
    </div>
    <div class="header-right">
      <el-popover
        class="header-right-dropdown"
        placement="bottom"
        v-model="payWayVisible"
      >
        <div class="pay-way">
          <p
            v-for="(item, index) in payways"
            :key="index"
            :class="index == payKey ? 'choose item' : 'item'"
            @click="selectPayway(index)"
          >
            {{ item }}
          </p>
        </div>
        <span
          :class="
            payText == $t('otc.payWay')
              ? 'el-dropdown-link'
              : 'el-dropdown-link changeColor'
          "
          slot="reference"
        >
          {{ payText }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
      </el-popover>
      <el-popover
        class="header-right-dropdown"
        placement="bottom"
        v-model="moneyVisible"
      >
        <div class="ways">
          <el-input
            @focus="cancelChoose"
            :placeholder="$t('otc.autoFilter')"
            v-model="moneyNum"
          >
            <!-- <span slot="suffix">EUR</span> -->

            <!-- 新开 -->
            <span slot="suffix">
              <el-popover
                class="header-right-dropdown"
                placement="bottom"
                v-model="payVisible"
              >
                <div class="pay-way">
                  <p
                    v-for="(item, index) in payList"
                    :key="index"
                    :class="index == payTypeKey ? 'choose item' : 'item'"
                    @click="selectPayType(index, item)"
                  >
                    {{ item }}
                  </p>
                </div>
                <span
                  :class="
                    payType == $t('otc.payWay')
                      ? 'el-dropdown-link'
                      : 'el-dropdown-link changeColor'
                  "
                  slot="reference"
                >
                  {{ payType
                  }}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
              </el-popover>
            </span>
          </el-input>
          <div class="ways-box">
            <p
              :class="index == moneyKey ? 'ways-item choose' : 'ways-item'"
              v-for="(item, index) in moneyArr"
              :key="index"
              @click="selectMoneyNum(index)"
            >
              {{ item }}
            </p>
          </div>
          <div class="btn-box">
            <p class="reset-btn" @click="resetMoney">{{ $t('otc.reset') }}</p>
            <p class="select-btn" @click="selectMoney">
              {{ $t('otc.filter') }}
            </p>
          </div>
        </div>
        <span
          :class="
            moneyText == $t('otc.transitionAmount')
              ? 'el-dropdown-link'
              : 'el-dropdown-link changeColor'
          "
          slot="reference"
        >
          {{ moneyText }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { legalPurchaseApi } from '../../../../../server/axios.js';
export default {
  props: {
    // 当前的active tab
    activeTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      payWayVisible: false,
      payKey: 0,
      // 支付方式
      payText: this.$t('otc.payWay'),
      moneyVisible: false,
      moneyNum: '',
      moneyArr: ['100', '1000', '10000', '50000', '100000', '500000'],
      moneyKey: null,
      // 交易金额
      moneyText: this.$t('otc.transitionAmount'),
      payVisible: true,
      payTypeKey: 0,
      payList: [],
      // 支付类型
      payType: this.$t('otc.payWay'),
    };
  },
  computed: {
    payways() {
      if (this.$i18n.locale === 'zh_CN') {
        return ['全部', '支付宝', '微信', '银行卡'];
      } else if (this.$i18n.locale === 'zh_TW') {
        return ['全部', '支付寶', '微信', '銀行卡'];
      } else {
        return ['All', 'Alipay', 'WeChat', 'Bank Card'];
      }
    },
  },
  created() {
    this.getOtcConfigType();
  },
  methods: {
    // 支付类型
    getOtcConfigType() {
      legalPurchaseApi.otcConfig().then((res) => {
        if (res.code == '200') {
          this.payList = res.data.currencies;
          this.payType = res.data.currencies[0];
        }
      });
    },
    // 支付类型
    selectPayType(i, item) {
      this.payTypeKey = i;
      this.payVisible = false;
      this.payType = item;
      this.$emit('selectPayways', this.payKey, this.payType);
    },
    // 支付方式
    selectPayway(i) {
      this.payKey = i;
      this.payText = this.payways[i];
      this.payWayVisible = false;
      this.$emit('selectPayways', this.payKey, this.payType);
    },
    // 交易金额
    selectMoneyNum(i) {
      this.moneyKey = i;
      this.moneyText = this.moneyArr[i];
      this.moneyNum = this.moneyArr[i];
    },
    // 输入框聚焦时，放弃选项
    cancelChoose() {
      this.moneyKey = null;
    },
    resetMoney() {
      this.moneyKey = null;
      this.moneyText = this.$t('otc.transitionAmount');
      this.moneyNum = '';
      this.$emit('selectMoneyWay', '');
    },
    selectMoney() {
      if (!this.moneyNum) return;
      this.moneyVisible = false;
      this.moneyText = this.moneyNum;
      this.$emit('selectMoneyWay', this.moneyNum); //注意null
    },
  },
};
</script>

<style lang="scss" scope>
$activeColor: #6175ae;
.free-trade-header {
  display: flex;
  justify-content: space-between;
  width: 1180px;
  margin: 0 auto;
  color: #000;
  height: 80px;
  line-height: 80px;
  .header-left {
    .header-tab {
      font-weight: 600;
      font-size: 17px;
      cursor: pointer;
    }
    .activeTab {
      position: relative;
      color: $activeColor;
      &::after {
        display: inline-block;
        content: '';
        position: absolute;
        bottom: -5px;
        width: 100%;
        left: 0;
        height: 3px;
        background-color: $activeColor;
      }
    }
    .header-divider {
      margin: 0 20px;
    }
  }
  .header-right {
    margin-right: -30px;
    .header-right-dropdown {
      margin-right: 20px;
    }
    &:nth-last-child(0) {
      margin-right: 0;
    }
  }
}
// popover样式
.item {
  display: inline-block;
  width: 90px;
  height: 28px;
  background: #f0f0f0;
  border-radius: 5px;
  font-size: 12px;
  color: #3d3a50;
  line-height: 28px;
  margin: 5px;
  text-align: center;
  cursor: pointer;
  &.choose {
    border: 1px solid #6175ae;
    background-color: white;
    color: #6175ae;
  }
}
.changeColor {
  color: #6175ae;
}
.ways {
  width: 334px;
  .ways-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .ways-item {
      width: 90px;
      height: 28px;
      background: #f0f0f0;
      border-radius: 5px;
      font-size: 12px;
      color: #3d3a50;
      line-height: 28px;
      text-align: center;
      margin-top: 16px;
      cursor: pointer;
      &.choose {
        border: 1px solid #6175ae;
        background-color: white;
        color: #6175ae;
      }
    }
  }
  .btn-box {
    margin-top: 16px;
    display: flex;
    .select-btn {
      width: 150px;
      height: 40px;
      background: #6175ae;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      margin-left: 30px;
      cursor: pointer;
    }
    .reset-btn {
      width: 150px;
      height: 40px;
      background: white;
      font-size: 14px;
      color: #3d3a50;
      cursor: pointer;
      text-align: center;
      line-height: 40px;
      border: 1px solid #e6e6e6;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  border: none;
  outline: none;
}
</style>
