<template>
    <div>
        <el-tabs type="border-card" @tab-click="tabClickHandle" v-model="tabsValue">
            <el-tab-pane label="日报" name="day">
                <div class="info__search">
                    <el-form :inline="true" :model="formInline" size="small" key="day">
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="formInline.startDate" type="date" placeholder="选择开始日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-date-picker v-model="formInline.endDate" type="date" placeholder="选择结束日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('day')">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-row type="flex" style="margin-bottom: 20px;">
                    <el-button type="primary" size="small" @click="exportReport">导出</el-button>
                </el-row>
                <statistics-table :init='initTable' ref="day" :type="type"></statistics-table>
            </el-tab-pane>
            <el-tab-pane label="月报" name="month">
                <div class="info__search">
                    <el-form :inline="true" :model="formInline" size="small" key="month">
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="formInline.startDate" type="month" placeholder="选择开始日期"
                                value-format="yyyy-MM"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-date-picker v-model="formInline.endDate" type="month" placeholder="选择结束日期"
                                value-format="yyyy-MM"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('month')">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-row type="flex" style="margin-bottom: 20px;">
                    <el-button type="primary" size="small" @click="exportReport">导出</el-button>
                </el-row>
                <statistics-table :init='initTable' ref="month" :type="type"></statistics-table>
            </el-tab-pane>
            <el-tab-pane label="年报" name="year">
                 <div class="info__search">
                    <el-form :inline="true" :model="formInline" size="small" key="year">
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="formInline.startDate" type="year" placeholder="选择开始日期"
                                value-format="yyyy"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-date-picker v-model="formInline.endDate" type="year" placeholder="选择结束日期"
                                value-format="yyyy"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('year')">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-row type="flex" style="margin-bottom: 20px;">
                   <el-button type="primary" size="small" @click="exportReport">导出</el-button>
                </el-row>
                <statistics-table :init='initTable' ref="year" :type="type"></statistics-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
    import {
        Component,
        Vue,
        Provide
    } from "vue-property-decorator";
    import statisticsTable from './statisticsTable.vue';
    @Component({
        components: {
            statisticsTable
        }
    })
    export default class statistics extends Vue {
        private tableData: any = []
        private type:number = 1
        private tabsValue: string = 'day'
        private formInline: any = {}

        public mounted() {
             (this['$refs']['day'] as any).initTable();
        }
        private initTable (info:any) {
            return this.$axios({
                url: '/pc/card/report',
                params: {
                    type: this.type,
                    ...info,
                    ...this.formInline
                }
            })
        }
        private exportReport () {
                this.$axios(
      {
        url: "/pc/card/exportReport",
        responseType: "blob",
        params: {
            type: this.type,
            ...this.formInline
        }
      },
      false
    ).then((res: any) => {
      const file = new Blob([res.data]);
      const reader = new FileReader();
      reader.addEventListener("loadend", function() {
        const link: any = document.createElement("a");
        link.href = reader.result;        
        link.download = decodeURIComponent(res.headers['filename']);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      reader.readAsDataURL(file);
    });
        }
        private onSubmit (type) {
            (this['$refs'][type] as any).initTable();
            
        }
        private tabClickHandle (obj) {
            this.formInline = {};
            switch (obj.name) {
                case 'day':
                    this.type = 1
                    break;
                     case 'month':
                         this.type = 2
                    break;
                     case 'year':
                         this.type = 3
                    break;
                    default: 
                    this.type = 1
                    break;
            }
            (this['$refs'][obj.name] as any).initTable();
        }
    }
</script>
<style lang="scss" scoped>
    .info__search {
        text-align: left;
    }
</style>