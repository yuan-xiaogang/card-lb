<template>
  <div>
    <div class="info__search">
      <el-form :inline="true" :model="formInline" size="small">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="卡类型">
          <el-select v-model="formInline.type" placeholder="卡类型" clearable>
            <el-option label="普通卡" :value="1"></el-option>
            <el-option label="团体卡" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="formInline.startDate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="formInline.endDate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-button size="small" type="primary" @click="openDialog">新增</el-button>
    </el-row>
    <div v-tbHeight>
      <el-table :data="tableData" border height="100%">
        <el-table-column prop="name" label="姓名" width="160"></el-table-column>
        <el-table-column prop="identityCard" label="身份证" width="180"></el-table-column>
        <el-table-column prop="telphone" label="手机号码" width="150"></el-table-column>
        <el-table-column prop="cardName" label="卡类型" width="150"></el-table-column>
        <el-table-column prop="isActivate" label="是否激活" width="80">
          <template slot-scope="scope">{{scope.row.isActivate ? '是': '否'}}</template>
        </el-table-column>
        <el-table-column prop="ifEnter" label="是否已录入人脸" width="120">
          <template slot-scope="scope">{{scope.row.ifEnter ? '是': '否'}}</template>
        </el-table-column>
        <el-table-column prop="orderDate" label="生效时间" width="180"></el-table-column>
        <el-table-column prop="expiringDate" label="失效时间" min-width="180"></el-table-column>
        <!-- <el-table-column prop="amount" label="购买金额(元)" width="150"></el-table-column>
        <el-table-column prop="company" label="所属公司" width="150"></el-table-column>
        <el-table-column prop="comments" label="备注" width="150"></el-table-column> -->

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">

            <el-button size="mini" type="danger" :disabled="scope.row.type === 1 && scope.row.isActivate === 1"
              @click="openActiveDialog(scope.row)">激活
            </el-button>
            <el-button size="mini" @click="openFace">人脸录入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="card__pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber"
        :page-sizes="[20, 30, 40, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
    <el-dialog title="信息" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small" class="info__form">
        <!-- <el-form-item label="优惠标志" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="item.id" v-for="(item) of cardTypeList" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-postcard">读取身份证信息</el-button>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="identityCard">
          <el-input v-model="ruleForm.identityCard" placeholder="请输入身份证号码">
            <!-- <el-button slot="append" icon="el-icon-postcard"></el-button> -->
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telphone">
          <el-input v-model="ruleForm.telphone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="激活卡" :visible.sync="activeVisible" width="30%">
      <el-form :model="activeForm" :rules="activeRules" ref="activeForm" label-width="90px" size="small"
        class="info__form">

        <el-form-item label="卡类型" prop="type">
          <el-radio-group v-model="activeForm.type" @change="changeType">
            <el-radio :label="1">Vip会员</el-radio>
            <el-radio :label="2">先锋居民</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="激活码" prop="activateNum" v-if="activeForm.type === 1">
          <el-input v-model="activeForm.activateNum" style="width: 220px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="activeVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitActiveForm('activeForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="人脸录入" :visible.sync="faceVisible" width="50%">
      <div>
        <video ref="video" width="500" height="500" autoplay muted></video>
        <canvas style="display:none;" ref="canvas" width="500" height="500"></canvas>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="faceVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="faceVisible = false" size="small">确 定</el-button>
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
  import {
    validatePhone,
    validateIdCard
  } from '@/utils/validate.js';
  const checkTelphone = (rule: any, value: any, callback: any) => {
    if (!validatePhone(value)) {
      return callback(new Error('手机号码格式错误'));
    }
    callback();
  };
  const checkIdCard = (rule: any, value: any, callback: any) => {
    if (!validateIdCard(value)) {
      return callback(new Error('身份证号码格式错误'));
    }
    callback();
  };


  @Component({})
  export default class CardInfo extends Vue {
    private formInline: object = {};
    private total: number = 0;
    private pageSize: number = 20;
    private pageNumber: number = 0;
    private tableData: any = [];
    private baseUrl = process.env.NODE_ENV === 'production' ? MAINURL : TESTURL;
    private dialogVisible: boolean = false;
    private activeVisible: boolean = false;
    private faceVisible: boolean = false;
    private ruleForm: any = {
      name: '',
      identityCard: '',
      telphone: '',
      // type: null
    };
    private activeForm: any = {
      id: null,
      type: null,
      isActivate: null,
      activateNum: ''
    };
    // private cardTypeList: [] = [];
    private activeRules: any = {
      type: [{
        required: true,
        message: '请选择卡类型',
        trigger: 'change'
      }],
      // activateNum: [{
      //     required: true,
      //     message: '请输入激活码',
      //     trigger: 'blur'
      //   }]
    };

    private rules: any = {
      // type: [{
      //   required: true,
      //   message: '请选择优惠标志',
      //   trigger: 'change'
      // }],
      name: [{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }, ],
      identityCard: [{
          required: true,
          message: '请输入身份证号码',
          trigger: 'blur'
        },
        {
          validator: checkIdCard,
          trigger: 'blur'
        }
      ],
      telphone: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          validator: checkTelphone,
          trigger: 'blur'
        }
      ]
    };
    // private pageStatus: string = 'add';
    public created() {
      this.initTable();
      // this.getCardList();

    }
    // public mounted() {
    //    this.openVideo();
    // }
    private get _params() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        ...this.formInline
      };
    }
    // private getCardList() {
    //   this.$axios({
    //     url: "/card/getItemList"
    //   }).then((res: any) => {
    //     if (res.success) {
    //       this.cardTypeList = res.result.cardType;
    //     }
    //   });
    // }
    private initTable() {
      this.$axios({
        url: "/pc/card/getList",
        params: this._params
      }).then((res: any) => {
        this.total = res.result.total;
        this.tableData = res.result.records || [];
      });
    }
    // 打开摄像头
    private openVideo() {
      let MediaStreamTrack: any;

      let video = this.$refs.video;
console.log(navigator.mediaDevices);
console.log(navigator.getMedia);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then(function (stream) {
          console.log(stream);
          MediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
          video.src = (window.URL).createObjectURL(stream);
          video.play();
        }).catch(function (err) {
          console.log(err);
        });
      } else if (navigator.getMedia) {
        navigator.getMedia({
          video: true
        }).then(function (stream) {
          console.log(stream);
          MediaStreamTrack = stream.getTracks()[1];
          video.src = (window.webkitURL).createObjectURL(stream);
          video.play();
        }).catch(function (err: any) {
          console.log(err);
        });
      }
    }
    // 打开人脸
    private openFace() {
      this.faceVisible = true;
      this.openVideo();
    }
    // 切换卡类型
    private changeType(type: number) {
      this.$set(this.activeForm, 'activateNum', '');
      if (type === 1) {
        this.$set(this.activeRules, 'activateNum', [{
          required: true,
          message: '请输入激活码',
          trigger: 'blur'
        }])
      } else {
        if (this.activeRules['activateNum']) {
          this.$delete(this.activeRules, 'activateNum')
        }
      }

    }
    // 激活卡
    private submitActiveForm(formName: string) {
      this.$refs[formName].validate((valid: any) => {
        if (valid) {
          this.$axios({
            url: '/pc/card/activate',
            method: 'POST',
            data: this.activeForm
          }).then((res: any) => {
            if (res.success) {
              this.$message({
                message: '激活成功',
                type: 'success'
              });
              this.activeVisible = false;
              this.initTable();
            }

          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }

    // 打开弹框
    private openDialog() {
      this.dialogVisible = true;
      this.$nextTick(function () {
        this.$refs['ruleForm'].resetFields();
      })
      //  this.pageStatus = 'add';
    }
    // 打开卡激活页面
    private openActiveDialog(row: any) {
      this.activeVisible = true;
      this.activeForm = {
        id: row.id
      };
    }
    // 确认新增用户
    private submitForm(formName: string) {
      this.$refs[formName].validate((valid: any) => {
        if (valid) {
          this.$axios({
            url: '/card/getInfoById',
            method: 'POST',
            data: {
              ...this.ruleForm,
              isMobile: 1
            }
          }).then((res: any) => {
            if (res.success) {
              if (res.result.valid) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.initTable();
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
              }

            }

          })
        } else {
          // console.log('error submit!!');
          return false;
        }
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