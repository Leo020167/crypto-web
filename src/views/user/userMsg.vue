<template>
    <div class="user-msg" v-document-title :data-title="documentTitle">
        <p class="msg-title"><i class="el-icon-message-solid"></i>{{$t('common.message')}}</p>
        <ul class="popover-ul">
            <li class="popover-item" v-for="(item, index) in messageList" :key="index">
                <p class="message-title"><span class="left">{{item.title}}</span><span class="right">{{transTime(item.createTime)}}</span></p>
                <p class="tip">{{fileText(item.content)}}</p>
            </li>
        </ul>
        <div class="page">
            <el-pagination
                small
                hide-on-single-page
                layout="prev, pager, next"
                @current-change="changePage"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { security } from "@/server/axios.js";
import { transforTime } from '@/utils/time.js';
export default {
    data() {
        return{
            pageNo: 1,
            total: 0,
            messageList: []
        }
    },
    created() {
        this.getMymessage()
    },
    computed: {
        documentTitle() {
            return this.getTitleValueByLang('系统通知','系統通知','System notification')
        }
    },
    methods: {
        // 获取我的消息
        getMymessage() {
            security.getMymessage(this.pageNo).then((res) => {
                if (res.code == 200) {
                    let data = res.data
                    this.messageList = data.data
                    this.total = Number(data.total)
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        fileText(text) {
            let data = text.replace(/↵/g, "\n")
            return data
        },
        changePage(i) {
            this.pageNo = i
            this.getMymessage()
        },
        transTime(time) {
            return transforTime.returnAllTime(time)
        },
    },
}
</script>

<style lang="scss" scoped>
.user-msg{
    width: 96%;
    margin: 15px auto;
    background-color: white;
    min-height: 640px;
    color: $bgGrey;
    padding: 20px 50px;
    .msg-title{
        font-size: 20px;
        margin-bottom: 20px;
        .el-icon-message-solid{
            margin-right: 6px;
        }
    }
    .popover-ul{
        max-height: 500px;
        overflow-y: auto;
        padding: 0 20px;
        .popover-item{
            padding: 15px 0;
            border-bottom: 1px solid $border;
            .message-title{
                display: flex;
                .left{
                    flex: 1;
                    font-size: 14px;
                    font-weight: bold;
                }
                .right{
                    font-size: 12px;
                    color: $color_info;
                }
            }
            .tip{
                margin-top: 8px;
                font-size: 13px;
                line-height: 26px;
                white-space: pre-wrap;
            }
        }
    }
    .page{
        margin-top: 20px;
        text-align: right;
    }
}
</style>