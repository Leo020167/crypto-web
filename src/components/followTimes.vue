<template>
    <div class="dialog-container">
        <el-dialog title="跟单倍数设置" :visible.sync="ifShowDialog" @close="closeDialog" v-loading="showLoading">
           <div class="opration-stop">
             <span class="name">倍数</span>
             <p class="input-box">
                 <input v-model="setPercent" @keyup="handleinput" class="input-text" placeholder="请输入正整数（1-100）"/>
                 <span class="io">倍</span>
             </p>
            </div> 
            <div class="botton">
                <el-button class="cancel" type="text" @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="enterStop">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {assetsApi} from '@/server/axios.js'
export default {
    props:{
      showDialog: {
          type: Boolean,
          default: false
      }
    },
    data() {
        return {
            setPercent: '',
            showLoading: false
        }
    },
    computed: {
        ifShowDialog: {
            get() {
                return this.showDialog
            },
            set() {
                return this.showDialog
            }
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog')
        },
        enterStop() {
            let num = Number(this.setPercent)
            if (!num || num < 0 || num > 100) {
                this.$message.error('请输入正整数（1-100）')
                return
            }
            assetsApi.setFollowTimes(this.setPercent).then((res) => {
                if (res.code === '200') {
                    this.$message.success(res.msg)
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 监听输入, 输入订正
        handleinput() {
            let str = '' + this.setPercent;
            if (str.indexOf('.') != -1) {
                let arr = str.split('');
                arr.splice(arr.length - 1);
                let str2 = arr.join('');
                this.setPercent = +str2;
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.dialog-container{
    .el-dialog{
        width: 35%;
    }
   .opration-stop{
       display: flex;
       font-size: 14px;
       .name{
           color: #8b8996;
       }
       .input-box{
           margin-left: 20px;
           flex: 1;
           display: flex;
           .input-text{
               flex: 1;
               outline:none;
               border:none;
               border-bottom: 1px solid #b1b0b947;
               padding-bottom: 4px;
           }
       }
   } 
   .botton{
       margin-top: 35px;
       text-align: right;
       .cancel{
          margin-right: 20px;
        }
   }
}
</style>