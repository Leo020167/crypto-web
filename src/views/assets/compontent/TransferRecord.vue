<template>
    <div class="current-order">
        <NullRecord v-if="transferList.length === 0">{{$t('common.no_data')}}</NullRecord>
        <el-table :data="transferList" style="width: 100%" v-else>
            <el-table-column :label="$t('assets.time')" align="center">
                <template slot-scope="scope">
                    <p>{{transTime(scope.row.createTime)}}</p>
                </template>
            </el-table-column>
            <el-table-column :label="$t('assets.direction')" align="center">
                <template slot-scope="scope">
                    <p :class="scope.row.fromAccountType === transType ? 'greenText' : 'redText'">{{scope.row.fromAccountType === transType ? $t('assets.out') : $t('assets.in')}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="typeValue" :label="$t('assets.type')" align="center"></el-table-column>
            <el-table-column prop="amount" :label="$t('assets.transfer_amount')" align="center"></el-table-column>
        </el-table>
        <Pagination v-show="total > pageSize"  @changePage="changePageNo" :recordsTotal="total" :currentPage="pageNo" :pageSize="pageSize"></Pagination>
    </div>
</template>

<script>
import {transforTime} from '@/utils/time.js'
export default{
    name: "TransferRecord",
    props: {
        transferList: {
            type: Array,
            default: function() {
                return []
            }
        },
        total:{
            type: Number,
            default: 1
        },
        pageNo: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 1
        },
        transType: {
            type: String,
            default: ''
        }
    },
    methods: {
        transTime(time) {
            return transforTime.returnAllTime(time)
        },
        changePageNo(no) {
            this.$emit("changePage", no)
        }
    }
}
</script>

<style lang="scss" scope>
.redText{
    color: #e2214e;
}
.greenText{
    color: #00ad88;
}
</style>