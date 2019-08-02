<template>
  <div>
    <div class="info__search">
      <el-form :inline="true" :model="formInline" size="small">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="卡类型">
          <el-select v-model="formInline.type" placeholder="卡类型" clearable >
            <el-option label="普通卡" :value="1"></el-option>
            <el-option label="团体卡" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="formInline.startDate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="formInline.endDate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-button size="small" type="primary">新增</el-button>
    </el-row>
    <div v-tbHeight>
      <el-table :data="tableData" border height="100%">
        <el-table-column prop="name" label="姓名" width="160"></el-table-column>
        <el-table-column prop="identityCard" label="身份证" width="180"></el-table-column>
        <el-table-column prop="telphone" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="cardName" label="卡类型" width="150"></el-table-column>
        <el-table-column prop="orderDate" label="生效时间" width="180"></el-table-column>
         <el-table-column prop="expiringDate" label="失效时间"  width="180"></el-table-column>
        <el-table-column prop="amount" label="购买金额(元)" width="150"></el-table-column>
        <el-table-column prop="company" label="所属公司" width="150"></el-table-column>
        <el-table-column prop="comments" label="备注" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        
                        <el-button size="mini" type="danger">激活
                        </el-button>
                        <el-button size="mini">人脸识别</el-button>
                    </template>
                </el-table-column>
      </el-table>
    </div>
    <div class="card__pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MAINURL, TESTURL } from '@/config/index';
@Component({})
export default class CardInfo extends Vue {
  private formInline: object = {};
  private total: number = 0;
  private pageSize: number = 20;
  private pageNumber: number = 0;
  private tableData: any = [];
  private baseUrl = process.env.NODE_ENV === 'production'? MAINURL: TESTURL
  public created() {
    this.initTable();

  }
  private get _params() {
    return {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      ...this.formInline
    };
  }
  private initTable() {
    this.$axios({
      url: "/pc/card/getList",
      params: this._params
    }).then((res: any) => {
      this.total = res.result.total;
      this.tableData = res.result.records || [];
    });
  }


  private onSubmit() {
    this.initTable();
  }
  private handleSizeChange(size: number) {
    this.pageSize = size;
    this.initTable();
  }
  private handleCurrentChange(page: number) {
    this.pageNumber = page;
    this.initTable();
  }
}
</script>

<style lang="scss" scoped>
.info__search {
  text-align: left;
}
.card__pagination {
  padding: 10px 0;
}
</style>

