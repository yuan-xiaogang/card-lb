<template>
    <div>
        <div class="info__search">
            <el-form :inline="true" :model="formInline" size="small">
                <el-form-item label="植物名称">
                    <el-input v-model="formInline.name" placeholder="植物名称"></el-input>
                </el-form-item>
                <el-form-item label="景点名称">
                    <el-input v-model="formInline.spot" placeholder="景点名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-row type="flex" style="margin-bottom: 20px;">
            <el-button size="small" type="primary" style="margin-right: 6px;" @click="openPlant">录入信息</el-button>
            <el-upload :action="`${baseUrl}/pc/card/batchImport`" :on-success="uploadFile" :show-file-list="false"
                :data="uploadData">
                <el-button size="small" type="primary">导入植物信息</el-button>
            </el-upload>
            <el-button type="text" size="small" @click="getModule" style="margin-left: 6px;">导出模板</el-button>
        </el-row>
        <div v-tbHeight>
            <el-table :data="tableData" border height="100%">
                <el-table-column prop="name" label="名称" width="160"></el-table-column>
                <el-table-column prop="spot" label="所属景点" width="150"></el-table-column>
                <el-table-column prop="iconImg" label="小图标图片" width="180"></el-table-column>
                <el-table-column prop="showImg" label="展示图片" width="180"></el-table-column>
                <el-table-column prop="voiceUrl" label="语音地址" width="150"></el-table-column>

                <el-table-column prop="comments" label="备注"></el-table-column>
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="card__pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNumber" :page-sizes="[20, 30, 40, 50]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <el-dialog title="信息" :visible.sync="dialogVisible" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small" class="info__form">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="小图标图片">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                       :before-upload="beforeUpload"
                       accept="image/*"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>

                <el-form-item label="备注" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </el-form-item> -->
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {
        Component,
        Vue
    } from "vue-property-decorator";
    import {
        MAINURL,
        TESTURL
    } from '@/config/index';
    @Component({})
    export default class CardInfo extends Vue {
        private baseUrl = process.env.NODE_ENV === 'production' ? MAINURL : TESTURL
        private formInline: object = {};
        private total: number = 0;
        private pageSize: number = 20;
        private pageNumber: number = 0;
        private tableData: any = [];
        private uploadData: any = {}
        private ruleForm: any = {}
        private dialogVisible: boolean = false
        private formStatus: string = 'add'
        private rules: any = {
            name: [{
                required: true,
                message: '请输入名称',
                trigger: 'blur'
            }, ]
        }
        public created() {
            this.initTable();
            this.uploadData = {
                userAccount: JSON.parse((sessionStorage.getItem('userToken') as string)).userAccount
            }
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
                url: "/pc/plant/getList",
                params: this._params
            }).then((res: any) => {
                this.total = res.result.total;
                this.tableData = res.result.records || [];
            });
        }
        // 上传文件
        private beforeUpload (file: any) {
            console.log('123');
            
            this.$oss.put('object', file).then((rl: any) => {
                console.log(rl);
            })
            return false
        }
        // 编辑
        private handleEdit(row: any) {
            this.dialogVisible = true;
            this.formStatus = 'edit'
            this.ruleForm = Object.assign({}, row);
        }
        // 删除
        private handleDelete(row: any) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios({
                    method: 'DELETE',
                    url: 'pc/plant/delete',
                    params: {
                        id: row.id
                    }
                }).then((res: any) => {
                    if (res.success) {
                        this.initTable();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })

            }).catch(() => {

            });
        }
        // 打开新增dialog
        private openPlant() {
            this.dialogVisible = true;
            this.formStatus = 'add';
            this.$nextTick(function () {
                this.$refs['ruleForm'].resetFields();
                this.ruleForm = {};
            })
        }
        // 录入信息
        private submitForm(formName: string) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.formStatus === 'add') {
                        this.$axios({
                            method: 'POST',
                            url: '/pc/plant/add',
                            data: this.ruleForm
                        }).then((res: any) => {
                            this.dialogVisible = false;
                            this.initTable();
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });

                        })
                    } else if (this.formStatus === 'edit') {
                        this.$axios({
                            method: 'PUT',
                            url: '/pc/plant/update',
                            data: this.ruleForm
                        }).then((res: any) => {
                            this.dialogVisible = false;
                            this.initTable();
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }
        private uploadFile(res: any) {
            if (res.success) {
                this.$message({
                    message: '导入成功',
                    type: 'success'
                });
                this.initTable();
            } else {
                this.$message.error(res.message);
            }
        }
        private getModule() {
            this.$axios({
                    url: "/pc/card/export",
                    responseType: "blob"
                },
                false
            ).then((res: any) => {
                const file = new Blob([res.data]);
                const reader = new FileReader();
                reader.addEventListener("loadend", function () {
                    const link: any = document.createElement("a");
                    link.href = reader.result;
                    link.download = "导入模板.xlsx";
                    link.style.display = "none";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
                reader.readAsDataURL(file);
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
    .info__form {
        text-align: left;
    }
</style>