<template lang="">
  <div>
    <div class="px-12 py-7 text-[#666666]">
      <div class="bg-white py-4 px-8 rounded-md">
        <div class="flex items-center mb-4">
          <img src="../../assets/logo.png" class="w-8 h-8" />
          <span class="ml-1 text-black">{{ $t('address-list.text1') }}</span>
        </div>

        <div>
          <div class="flex">
            <div class="w-[500px]">
              <span>{{ $t('address-list.text2') }}</span>
              <el-select v-model="symbol" class="mt-4">
                <el-option
                  v-for="item in coinList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>

            <div v-if="symbol === 'USDT'" class="ml-5">
              <span>{{ $t('address-list.text3') }}</span>
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
          </div>
        </div>

        <div class="mt-5 w-[500px]">
          <el-form label-position="top" label-width="80px" :model="formData">
            <el-form-item :label="$t('address-list.text4')">
              <el-input v-model="formData.address"></el-input>
            </el-form-item>
            <el-form-item :label="$t('address-list.text5')">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="showPayPwd = true">{{
                $t('address-list.text6')
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="bg-white py-4 px-8 rounded-md mt-5">
        <el-table :data="addressList" style="width: 100%" row-key="id">
          <el-table-column
            prop="symbol"
            :label="$t('address-list.text7')"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            :label="$t('address-list.text8')"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chainType"
            :label="$t('address-list.text9')"
            align="center"
          >
            <template v-slot="{ row }">
              {{ row.symbol === 'USDT' ? row.chainType : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            :label="$t('address-list.text5')"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            :label="$t('address-list.text10')"
            align="center"
            width="150"
          >
            <template v-slot="{ row }">
              <el-button size="mini" type="danger" @click="handleDelete(row)">{{
                $t('address-list.text10')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <PayPasswordToast
      v-if="showPayPwd"
      :showError="showError"
      :errormsg="message"
      @hidePwd="hidePwd"
      @getPwd="getPwd"
    ></PayPasswordToast>
  </div>
</template>
<script>
import {
  coinList,
  addAddress,
  addressList,
  delAddress,
} from '@/server/axios.js';

import PayPasswordToast from '@/components/payPasswordToast.vue';
import md5 from 'js-md5';

export default {
  components: { PayPasswordToast },
  data: () => ({
    chainTypeList: [],
    coinList: [],
    symbol: 'USDT',
    chainType: '',
    formData: {},

    addressList: [],

    showPayPwd: false,
    showError: false, //40032
    message: 'Please enter the 6-digit payment password',
    payPass: '',

    current: null,
  }),
  created() {
    this.getAddressList();

    coinList({ inOut: -1 }).then((res) => {
      this.chainTypeList = res.data.chainTypeList;
      this.coinList = res.data.coinList;

      this.chainType = this.chainTypeList?.[0];
    });
  },
  methods: {
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      if (this.action === 'delete') {
        delAddress({
          addressId: this.current?.id,
        }).then(this.handleResult);
      } else {
        this.onSubmit();
      }
    },
    getAddressList() {
      addressList({}).then((res) => {
        this.addressList = res.data;
      });
    },
    handleDelete(row) {
      this.current = row;
      this.$confirm(
        this.$t('address-list.text12'),
        this.$t('address-list.text13'),
        {
          confirmButtonText: this.$t('address-list.text14'),
          cancelButtonText: this.$t('address-list.text15'),
          type: 'warning',
        }
      ).then(() => {
        this.showPayPwd = true;
        this.action = 'delete';
      });
    },
    onSubmit() {
      if (!this.formData.address || !this.formData.address.trim().length) {
        this.$message.error(this.$t('address-list.text16'));
        return;
      }
      addAddress({
        address: this.formData.address,
        chainType: this.symbol === 'USDT' ? this.chainType : '',
        remark: this.formData.remark ?? '',
        symbol: this.symbol,
        payPass: md5(this.payPass).toUpperCase(),
      }).then(this.handleResult);
    },
    handleResult(res) {
      this.action = '';
      this.current = null;

      if (res.code === '200') {
        this.$message.success(res.msg);
        this.getAddressList();
        this.showPayPwd = false;
      } else if (res.code == '40030') {
        //提示支付密码没设置
        this.showPayPwd = true;
        this.showError = false;
      } else if (res.code == '40032') {
        //支付密码错误
        this.message = res.msg;
        this.showError = true;
      } else if (res.code == '40031') {
        //用户没设置过交易密码
        this.$confirm(
          'You have not set the transaction password. Go to set it?',
          'Tips',
          {
            confirmButtonText: 'Go to settings',
            cancelButtonText: 'Unset',
            type: 'warning',
          }
        )
          .then(() => {
            this.$router.push('/user/safePassword');
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: 'Unset',
            });
          });
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
<style lang="scss">
.el-form-item {
  .el-form-item__label {
    padding: 0;
    line-height: 14px;
  }
  .el-input__inner {
    border: 0;
    border-bottom: 1px solid #eeeeee;
    border-radius: 0;
    padding: 0;
    &:focus {
      border-color: #2e8ded;
    }
  }
}
</style>
