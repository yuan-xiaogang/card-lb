<template>
  <div class="login">
    <div class="login__bg">
      <div class="login__form">
        <p class="login__form_title">用 户 登 录</p>
        <div class="login__form_body">
          <el-form :model="loginForm" ref="loginForm" label-width="0" :rules="rules">
            <el-form-item prop="userAccount">
              <el-input v-model="loginForm.userAccount" placeholder="请输入您的账号"></el-input>
            </el-form-item>
            <div class="login__form_pass">
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="请输入您的密码"
                  @keydown.enter.native="submitForm('loginForm')"
                ></el-input>
              </el-form-item>
              <div class="login__form_forgetPass">
                <!-- 忘记密码？ -->
              </div>
            </div>
            <el-form-item>
              <div class="login__btn" @click="submitForm('loginForm')">
                <!-- <el-button type="primary" @click="submitForm('loginForm')">登    录</el-button> -->
                登 录
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class login extends Vue {
  private loginForm: object = {};
  private rules: object = {
    userAccount: [
      {
        required: true,
        message: "请输入您的账号",
        trigger: "blur"
      }
    ],
    password: [
      {
        required: true,
        message: "请输入您的密码",
        trigger: "blur"
      }
    ]
  };
  private submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        // this["$router"].push("/");
       this.$axios({
         url: '/pc/user/login',
         method: 'POST',
         data: this.loginForm
       }).then((res: any) => {
         if (res.success) {
           sessionStorage.setItem('userToken', JSON.stringify(res.result));
           this["$router"].push("/");          
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
<style lang="scss" scoped>
.login {
  height: 100vh;
}

.login__logo {
  height: 80px;
  line-height: 80px;
  background: #ffffff;
}

.login__logo_img {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-left: 20%;
}

.login__word {
  font-size: 16px;
  color: #f96101;
  margin-left: 16px;
}

.login__bg {
  height: 100%;
  background: url("../../../assets/images/bg.svg") no-repeat 23% center;
  background-size: 50% auto;
  position: relative;
  min-width: 970px;
}

.login__form {
  position: absolute;

  // top: 282px;
  // right: 377px;
  top: 28.2%;
  right: 19.6%;

  width: 490px;
  height: 400px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 1px 40px #a8bde9;
}

.login__form_title {
  padding-top: 39px;
  font-size: 24px;
  color: #4d7ee7;
  font-weight: bold;
}

.login__form_body {
  padding: 39px 56px 0;
}

.login__btn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: #4d7ee7;
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
}

.login__form_body .el-input__inner {
  border-radius: 0;
  border: solid 1px #e1dddd;
  height: 48px;
  line-height: 48px;
}

.login__form_body {
  input::-webkit-input-placeholder {
    color: #a7a6a6;
    font-size: 14px;
  }
  .el-form-item {
    margin-bottom: 40px;
  }
  .login__form_pass {
    .el-form-item {
      margin-bottom: 51px;
    }
  }
}

.login__form_pass {
  position: relative;
}

.login__form_forgetPass {
  position: absolute;
  right: 0;
  bottom: -20px;
  transform: translateY(100%);
  font-size: 12px;
  color: #a7a6a6;
  &:hover {
    cursor: pointer;
  }
}
</style>