<template>
  <div class="topUp-container">
    <el-dialog :visible.sync="ifShowDialog" @close="closeDialog">
      <p class="dialog-title">{{ $t('assets.chainType') }}</p>
      <el-radio-group v-model="getRadioValue" @change="changRadio">
        <el-radio
          v-for="(item, index) in chainList"
          :key="index"
          :label="item"
          >{{ item }}</el-radio
        >
      </el-radio-group>
      <p class="dialog-title mt">{{ $t('assets.depositAddress') }}</p>
      <div class="upIn-address">
        <p class="address-text">{{ chainData.address }}</p>
        <span
          class="copy"
          @click="onCopy('address')"
          id="address"
          :data-clipboard-text="chainData.address"
          >{{ $t('assets.copy') }}</span
        >
        <el-popover
          placement="bottom"
          width="80"
          v-model="visible"
          trigger="click"
        >
          <qriously
            :value="chainData.address"
            :size="size"
            :backgroundAlpha="backgroundAlpha"
          />
          <span class="ewm" slot="reference">{{ $t('assets.ewm') }}</span>
        </el-popover>
      </div>
      <p class="dialog-title mt">{{ $t('assets.tips') }}</p>
      <ul>
        <li>{{ $t('assets.tips1') }}</li>
        <li>{{ $t('assets.tips2') }}</li>
        <li>
          {{ $t('assets.tips31') }}：{{ chainData.minWithdrawAmt }}USDT，{{
            $t('assets.tips32')
          }}。
        </li>
        <li>{{ $t('assets.tips4') }}</li>
        <li>{{ $t('assets.tips5') }}</li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
export default {
  name: 'TopUpDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    chainList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    chainData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    radioValue: {
      type: String,
      require: true,
    },
  },
  computed: {
    ifShowDialog: {
      get() {
        return this.showDialog;
      },
      set() {
        return this.showDialog;
      },
    },
  },
  data() {
    return {
      visible: false, //二维码的展示
      backgroundAlpha: 1,
      size: 125,
      getRadioValue: '',
    };
  },
  mounted() {
    this.getRadioValue = this.radioValue;
  },
  methods: {
    closeDialog() {
      this.$emit('closeTopup');
    },
    // 单选, 输出typeList的id
    changRadio(i) {
      this.$emit('changeRadioValue', i);
    },
    // 复制
    onCopy(id) {
      let that = this;
      var clipboard = new Clipboard(`#${id}`);
      clipboard.on('success', function () {
        that.$message.success(this.$t('payDialog.copySuccess'));
      });
      clipboard.on('error', function () {
        that.$message.error(this.$t('payDialog.copyError'));
      });
    },
  },
};
</script>

<style lang="scss" scope>
.topUp-container {
  .dialog-title {
    font-size: 14px;
    padding-bottom: 13px;
    color: #aeaeae;
    &.mt {
      margin-top: 30px;
    }
  }
  .upIn-address {
    font-size: 14px;
    display: flex;
    .address-text {
      min-width: 250px;
    }
    .copy {
      display: inline-block;
      margin-left: 36px;
      color: $color_main;
      cursor: pointer;
    }
    .ewm {
      display: inline-block;
      margin-left: 20px;
      color: $color_main;
      cursor: pointer;
    }
  }
  ul {
    padding-left: 12px;
    li {
      list-style-type: disc;
      margin-top: 12px;
      font-size: 13px;
      color: #999999;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}
.ewm-picture {
  width: 98%;
  display: block;
}
</style>
