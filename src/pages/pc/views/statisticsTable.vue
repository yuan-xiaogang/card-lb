<template>
    <div style="height: 100%;">
        <div style="height:690px;">
            <el-table :data="tableData" border height="100%">
                <el-table-column type="index" width="80">
                </el-table-column>
                <el-table-column prop="date" label="日期" width="130"></el-table-column>
                <el-table-column prop="commonCard" label="普通票（张）" width="120">
                    <template slot-scope="scope">
                        <div class="pointer" @click="openDialog(scope.row, 1)">
                            {{scope.row.commonCard}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sum1" label="普通票-合计（元）" width="140"></el-table-column>
                <!-- <el-table-column prop="payType" label="普通票-收付款方式"></el-table-column> -->
                <el-table-column prop="teamCard" label="团体票（张）" width="120">
                    <template slot-scope="scope">
                        <div class="pointer" @click="openDialog(scope.row, 2)">
                            {{scope.row.teamCard}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="binjiangCount" label="滨江公园"></el-table-column>
                <el-table-column prop="seyuanbeiCount" label="啬园北门"></el-table-column>
                <el-table-column prop="seyuanxiCount" label="啬园西门"></el-table-column>
                <el-table-column prop="junshanCount" label="军山大门"></el-table-column>
                <el-table-column prop="langshannanCount" label="狼山南门"></el-table-column>
                <el-table-column prop="langshandongCount" label="狼山东门"></el-table-column>
                <el-table-column prop="langshanbeiCount" label="狼山北门"></el-table-column>
                <!-- <el-table-column prop="payType2" label="团体票-收付款方式"></el-table-column> -->
            </el-table>
        </div>
        <div class="card__pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNumber" :page-sizes="[20, 30, 40, 50]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="80%">
            <div>
                <div>
                    <el-table :data="detailTable" border :height="500">
                        <el-table-column prop="name" label="姓名" width="160"></el-table-column>
                        <el-table-column prop="identityCard" label="身份证" width="180"></el-table-column>
                        <el-table-column prop="telphone" label="手机号码" width="180"></el-table-column>
                        <el-table-column prop="cardName" label="卡类型" width="150"></el-table-column>
                        <el-table-column prop="orderDate" label="生效时间" width="180"></el-table-column>
                        <el-table-column prop="expiringDate" label="失效时间" width="180"></el-table-column>
                        <el-table-column prop="amount" label="购买金额(元)" width="150"></el-table-column>
                        <el-table-column prop="company" label="所属公司" width="150"></el-table-column>
                        <el-table-column prop="comments" label="备注" width="150"></el-table-column>
                        <el-table-column prop="ifEnter" label="是否已录入人脸">
                            <template slot-scope="scope">{{scope.row.ifEnter ? '是': '否'}}</template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="card__pagination">
                    <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                        :current-page="pageNumber1" :page-sizes="[20, 30, 40, 50]" :page-size="pageSize1"
                        layout="total, sizes, prev, pager, next, jumper" :total="total1"></el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script lang="ts">
    import {
        Component,
        Vue,
        Prop,
        Inject
    } from "vue-property-decorator";
    @Component({})
    export default class statisticsTable extends Vue {
        private tableData: any = []
        private detailTable: any = []
        private pageNumber: number = 0
        private pageNumber1: number = 0
        private pageSize: number = 20
        private pageSize1: number = 20
        private total: number = 0
        private total1: number = 0
        private row: any = null
        private cardType: any = null
        private dialogVisible: boolean = false
        @Prop()
        private init: any
        @Prop({
            type: Number
        }) type: number;

        get params() {
            return {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            }
        }
        get params1() {
            return {
                pageNumber: this.pageNumber1,
                pageSize: this.pageSize1,
                date: this.row.date,
                cardType: this.cardType,
                type: this.type
            }
        }
        private initTable() {
            this.init(this.params).then((res: any) => {
                this.tableData = res.result.records;
                this.total = res.result.total;
            })
        }
        private handleSizeChange(size:number) {
            this.pageSize = size;
            this.initTable()
        }
        private handleCurrentChange(page:number) {
            this.pageNumber = page;
            this.initTable()
        }
        private handleSizeChange1(size:number) {
            this.pageSize = size;
            this.initTable1()
        }
        private handleCurrentChange1(page:number) {
            this.pageNumber = page;
            this.initTable1()
        }
        private initTable1() {
            this.$axios({
                url: '/pc/card/getDetailList',
                params: this.params1,
            }).then((res:any) => {
                this.detailTable = res.result.records
                this.total1 = res.result.total

            })
        }
        private openDialog(row: any, cardType:any) {
            this.detailTable = [];
            switch (cardType) {
                case 1:
                    if (row.commonCard) {
                        this.dialogVisible = true
                        this.row = row;
                        this.cardType = cardType;
                        this.initTable1();
                    }
                    break;
                case 2:
                    if (row.teamCard) {
                        this.dialogVisible = true
                        this.row = row;
                        this.cardType = cardType;
                        this.initTable1();
                    }
                    break;
            }

        }
    }
</script>
<style lang="scss" scoped>
    .card__pagination {
        padding: 10px 0;
    }

    .pointer {
        cursor: pointer;
        color: #409EFF;
    }
</style>