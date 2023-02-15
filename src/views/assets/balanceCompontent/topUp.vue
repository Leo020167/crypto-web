<template>
  <div>
    <div class="px-12 py-7 text-[#666666]">
      <div class="bg-white py-4 px-8 rounded-md">
        <div class="flex items-center mb-4">
          <img src="../../../assets/logo.png" class="w-8 h-8" />
          <span class="ml-1 text-black">{{ $t('deposit.title') }}</span>
        </div>

        <div class="flex items-center gap-8 text-xs">
          <div class="w-[500px]">
            <el-select v-model="symbol">
              <el-option
                v-for="item in coinList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <div>
            <div>{{ $t('deposit.text1') }}</div>
            <div class="mt-1">
              {{ chargeConfigs?.availableAmount ?? '--' }} {{ symbol }}
            </div>
          </div>
          <div>
            <div>{{ $t('deposit.text2') }}</div>
            <div class="mt-1">
              {{ chargeConfigs?.minChargeAmount ?? '--' }} {{ symbol }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-md mt-4">
        <div class="flex">
          <div class="w-[180px] h-[180px]">
            <qrcode
              :value="currentAddress?.address"
              :options="{ width: 180, height: 180 }"
            ></qrcode>
          </div>

          <div class="ml-5">
            <div class="mb-5" v-if="symbol === 'USDT'">
              <span>{{ $t('deposit.text3') }}</span>
              <div class="mt-4">
                <el-radio-group v-model="chainType">
                  <el-radio-button
                    :label="item"
                    v-for="item in chainTypeList"
                    :key="item"
                  ></el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div>
              <span>{{ $t('deposit.text4') }}</span>
              <div
                class="bg-[#EDF3FA] w-[550px] h-[40px] mt-4 text-[#2E8DED] flex items-center px-2.5 min-w-0"
              >
                <span
                  class="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none mr-2"
                  >{{ currentAddress?.address }}</span
                >
                <el-button
                  v-if="currentAddress?.address"
                  @click="onCopy"
                  type="primary"
                  size="small"
                  class="tag-read"
                  :data-clipboard-text="currentAddress?.address"
                  >{{ $t('deposit.text5') }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { coinList, getChargeConfigs, chargeSubmit } from '@/server/axios.js';

export default {
  data() {
    return {
      chainTypeList: [],
      coinList: [],
      symbol: 'USDT',
      chargeConfigs: {
        addressList: [],
        availableAmount: '',
        minChargeAmount: '',
      },
      chainType: '',
      amount: '',
    };
  },
  watch: {
    symbol: {
      immediate: true,
      handler() {
        if (this.symbol) {
          getChargeConfigs({ symbol: this.symbol }).then((res) => {
            this.chargeConfigs = res.data;
            this.chainTypeList = res.data?.addressList?.map((v) => v.chainType);
            this.chainType = res.data?.addressList?.[0]?.chainType;
            this.amount = this.chargeConfigs.minChargeAmount;
          });
        }
      },
    },
  },
  computed: {
    currentAddress() {
      if (this.symbol === 'USDT') {
        return this.chargeConfigs.addressList.find(
          (v) => v.chainType === this.chainType
        );
      }
      return this.chargeConfigs.addressList.find(
        (v) => (v.symbol = this.symbol)
      );
    },
  },
  created() {
    coinList({ inOut: 1 }).then((res) => {
      this.coinList = res.data.coinList;
    });
  },
  methods: {
    handleSubmit() {
      if (!this.amount || !this.amount.trim().length) {
        this.$message.error(this.$t('assets.text13'));
        return;
      }

      chargeSubmit({
        amount: this.amount,
        address: this.currentAddress?.address ?? '',

        symbol: this.symbol,
        chainType: this.symbol === 'USDT' ? this.chainType : '',
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$router.go(-1);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleAvatarSuccess(res) {
      this.file = res.raw;
      this.imageUrl = URL.createObjectURL(res.raw);
    },
    onCopy() {
      var clipboard = new Clipboard('.tag-read');

      clipboard.on('success', () => {
        clipboard.destroy();
      });

      clipboard.on('error', () => {
        clipboard.destroy();
      });
    },
  },
};
</script>

<style lang="scss">
.topUp {
  width: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px;
}
.topUpImage {
  width: 240px;
  margin-left: 60px;
  margin-top: 30px;
}
.topNav {
  display: flex;
  align-items: center;
  margin-top: 30px;
  button {
    width: 70px;
    height: 30px;
    padding: 0;
    margin-left: 20px;
  }
}
.cb {
  width: 100px;
  margin-top: 30px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
