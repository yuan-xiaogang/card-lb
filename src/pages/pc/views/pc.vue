<template>
  <el-container>
    <el-header></el-header>
    <el-container>
      <el-aside width="20%">
        <el-menu :router="true" :default-active="defaultActive">
          <template v-for="(route, index) of menuList">
             <el-menu-item :index="route.path" :key="index" v-if="!route.meta.access ||route.meta.access.includes(userInfo.userAccount)">
              <i :class="route.meta.icon"></i>
              <span slot="title">{{route.meta.title}}</span>
          </el-menu-item>
          </template>
         
          <!-- <el-menu-item index="/plant">
            <i class="el-icon-document"></i>
            <span slot="title">植物管理</span>
          </el-menu-item>
          <el-menu-item index="/entryRecord">
            <i class="el-icon-document"></i>
            <span slot="title">入园记录</span>
          </el-menu-item>
          <el-menu-item index="/operateRecord" v-if="userInfo.userAccount === 'admin'">
            <i class="el-icon-document"></i>
            <span slot="title">操作记录</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <i class="el-icon-document"></i>
            <span slot="title">年票数据统计</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main>
        <div class="logout">
          <span>登录账号: <em>{{userInfo.userAccount}}</em> </span>
          <div>
            <el-dropdown trigger="click" type="primary" @command="dropdownHandle">
              <span class="el-dropdown-link">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="out">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <div class="logout__dialog">
            <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
              <div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small">
                  <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
  import {
    Component,
    Vue,
    Watch
  } from "vue-property-decorator";
  import menu from '../menu';

  @Component({

  })
  export default class pc extends Vue {
    private defaultActive: string = menu[0].path
    private userInfo: any = {}
    private dialogVisible: boolean = false
    private ruleForm: any = {}
    private rules: any = {
      password: [{
        required: true,
        message: '请输入原密码',
        trigger: 'blur'
      }, ],
      newPwd: [{
        required: true,
        message: '请输入新密码',
        trigger: 'blur'
      }, ],
    }

    // private handleSelect (index, path) {
    // }
    public mounted() {
      this.defaultActive = this.$route.path;
      this.userInfo = JSON.parse((sessionStorage.getItem('userToken') as string));   
    }

    @Watch('$route')
    onRouteChanged(nVal: any) {
      this.defaultActive = nVal.path;
    }

    private get menuList () {
      return menu
    }

    private dropdownHandle(v) {
      if (v === 'out') {
        this.logout();
      } else if (v === 'pwd') {
        this.dialogVisible = true
        this.ruleForm = {
          password: '',
          newPwd: ''
        }
      }
    }
    private logout() {
      sessionStorage.removeItem('userToken')
      this.$router.push({
        name: 'login'
      })
    }
    private submitForm(formName) {
      (this.$refs[formName] as any).validate((valid) => {
        if (valid) {
          this.$axios({
            url: '/pc/user/modifyPwd',
            method: 'POST',
            data: {
              userAccount: JSON.parse((sessionStorage.getItem('userToken') as string)).userAccount,
              ...this.ruleForm
            }
          }).then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              });
              (this.$refs[formName] as any).resetFields();
              this.dialogVisible = false
              this.logout();
            } else {
              this.$message.error(res.message);
            }
          })
        } else {
          return false;
        }
      });
    }
  }
</script>



<style scoped lang="scss">
  .el-container {
    height: 100vh;
  }

  .el-header {
    // background: #ddd;
    height: 60px;
    line-height: 60px;
    background: url('../../../assets/images/banner.png') no-repeat center center;
    background-size: 100% auto;
    font-size: 18px;
    color: #f0f0f0;
  }

  .el-menu {
    border-right: none;
  }

  .el-aside {
    border-right: solid 1px #e6e6e6;
    min-width: 250px;
    max-width: 250px;
  }

  .logout {
    text-align: right;
    height: 37px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;

    &__dialog {
      text-align: left;
    }

    span {
      font-size: 16px;

      em {
        font-weight: 700;
      }

      &:first-of-type {
        margin-right: 20px;
      }
    }
  }
</style>