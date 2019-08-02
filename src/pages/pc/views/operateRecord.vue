<template>
  <div>
    <div class="info__search">
      <el-form :inline="true" :model="formInline" size="small">
        <el-form-item label="登录账号">
          <el-input v-model="formInline.userAccount" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="操作日期">
          <el-date-picker v-model="formInline.searchDate" type="date" placeholder="选择操作日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-tbHeight>
      <el-table :data="tableData" border style="width: 100%" height="100%">
        <el-table-column prop="userAccount" label="登录账号" width="180"></el-table-column>
        <el-table-column prop="createTime" label="登录时间" width="180"></el-table-column>
        <el-table-column prop="operation" label="操作记录"></el-table-column>
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
@Component({})
export default class CardInfo extends Vue {
  private formInline: object = {};
  private total: number = 0;
  private pageSize: number = 20;
  private pageNumber: number = 0;
  private tableData: any = [];
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
      url: "/pc/operation/getList",
      params: this._params
    }).then((res: any) => {
      this.total = res.result.total;
      this.tableData = res.result.records || [];
    });
  }
  private onSubmit() {
    this.initTable();
  }
    private handleSizeChange(size:number) {
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

