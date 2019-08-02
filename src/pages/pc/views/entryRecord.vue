<template>
  <div>
    <div class="info__search">
      <el-form :inline="true" :model="formInline" size="small">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属景区">
          <el-input v-model="formInline.scenicSpot" placeholder="所属景区"></el-input>
        </el-form-item> -->

        <el-form-item label="所属景区">
          <el-select v-model="formInline.scenicSpot" placeholder="所属景区" clearable >
            <el-option :label="item.scienicSpot" :value="item.serialnum" v-for="item of serialnumList" :key="item.serialnum"></el-option>
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
    <div v-tbHeight>
      <el-table :data="tableData" border style="width: 100%" height="100%">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="identityCard" label="身份证" width="180"></el-table-column>
        <el-table-column prop="enterDate" label="入园时间" width="180"></el-table-column>
        <el-table-column prop="expiringDate" label="失效时间" width="180"></el-table-column>
        <el-table-column prop="scenicSpot" label="所属景区"></el-table-column>
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
  private serialnumList: any = []
   public created() {
    this.initTable();
    this.getSerialnum();
  }
  private get _params() {
    return {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      ...this.formInline
    };
  }
  private getSerialnum () {
    this.$axios({
      url: '/pc/enterSport/getSportList'
    }).then((res: any) => {
      this.serialnumList = res.result;
      
    })
  }
  private initTable() {
    this.$axios({
      url: "/pc/enterSport/getList",
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

