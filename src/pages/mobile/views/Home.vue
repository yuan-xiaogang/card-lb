<template>
  <div class="home" :style="homeStyle">
    <div>
      <div class="header">
        <p class="header__left" @click.stop="onClickLeft">
          <img src="@img/left-arrow.png" alt>
          <span>返回</span>
        </p>
        <span class="header__title">五山联名卡</span>
      </div>
      <ul class="home__list">
        <li>
          <label>缴费项目</label>
          <span>{{payItem}}</span>
        </li>
        <li>
          <label>收费机构</label>
          <span>{{chargeOrg}}</span>
        </li>
      </ul>
      <ul class="home__list home__list_blank">
        <li @click="chooseCard">
          <label>优惠标志</label>
          <span class="home__list_icon">
            {{cardTypeName}}
            <img src="@img/right-arrow.svg" alt>
          </span>
        </li>
      </ul>
      <p class="home__desc">
        <em class="home__desc_first">*</em> 请确保个人信息真实有效
      </p>
      <ul class="home__list">
        <li>
          <label>姓名</label>
          <span class="home__list_icon list__input">
            <van-field v-model.trim="name" placeholder="请输入姓名" />
            <!-- <img src="@img/right-arrow.svg" alt> -->
          </span>
        </li>
        <li>
          <label>身份证号码</label>
          <span class="home__list_icon list__input">
            <van-field v-model="identityCard" placeholder="请输入身份证号码" />
            <!-- <img src="@img/right-arrow.svg" alt> -->
          </span>
        </li>
        <li>
          <label>手机号码</label>
          <span class="home__list_icon list__input">
            <van-field v-model="telphone" placeholder="请输入手机号码" type="tel" />
            <!-- <img src="@img/right-arrow.svg" alt> -->
          </span>
        </li>
      </ul>
    </div>
    <a href="javascript:void(0)" class="home__btn" @click="nextStep">下一步</a>

    <van-popup v-model="show" position="bottom" :overlay="false">内容</van-popup>
    <van-popup v-model="show" position="bottom">
      <van-picker show-toolbar :columns="cardType" @change="onChange" @confirm="confirmType" @cancel="show = false"
        value-key="name" />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from "vue-property-decorator";

  import {
    Picker,
    Popup,
    Field,
    Toast
  } from "vant";
  import {
    validatePhone,
    validateIdCard
  } from '@/utils/validate.js';
  import {
    getLoginParams
  } from '@/utils/tools.js';
  import hybrid_app from '@/assets/js/hybrid_app.js';

  @Component({
    components: {
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Field.name]: Field,
    }
  })
  export default class Home extends Vue {
    private homeStyle: object = {
      height: "100vh"
    };
    private show: boolean = false;
    private name: string = "";
    private telphone: number | null = null;
    private identityCard: number | null = null;
    private chargeOrg: string = "";
    private cardType: [] = [];
    private cardTypeName: string = "";
    private payItem: string = "";
    private type: number | null = null;

    public created() {
      // alert(getLoginParams(window.location.search))
      this.$axios({
        url: "/card/getItemList"
      }).then((res: any) => {
        if (res.success) {
          this.payItem = res.result.payItem;
          this.chargeOrg = res.result.chargeOrg;
          this.cardType = res.result.cardType;
          if (this.cardType && this.cardType.length > 0) {
            this.cardTypeName = ((this.cardType as any)[0] as any).name;
            this.type = ((this.cardType as any)[0] as any).id
          }
        }
      });
    }

    public mounted() {
      const height: number | void =
        document.documentElement.clientHeight ||
        document.body.clientHeight ||
        window.innerHeight;
      this.homeStyle = {
        height: height + "px"
      };
      if (localStorage.getItem('info')) {
        localStorage.removeItem('info');
      }
    }

    private onClickLeft() {
      hybrid_app.back();
    }
    private validateField() {
      // 判断票类型
      if (!this.cardTypeName) {
        Toast("请选择优惠标志");
        return false;
      }
      // 判断姓名
      if (!this.name) {
        Toast("请输入姓名");
        return false;
      }
      // 判断身份证
      if (!this.identityCard) {
        Toast("请输入身份证号码");
        return false;
      }
      if (!validateIdCard(this.identityCard)) {
        Toast("身份证号码格式有误");
        return false;
      }
      // 判断手机号
      if (!this.telphone) {
        Toast("请输入手机号码");
        return false;
      }
      if (!validatePhone(this.telphone)) {
        Toast("手机号码格式有误");
        return false;
      }
      return true
    }
    private  nextStep() {
      // todo 暂时注释，放开验证   
      if (!this.validateField()) return;
       const info: object = {
        name: this.name,
        identityCard: this.identityCard,
        telphone: this.telphone,
        type: this.type,
        loginParam: getLoginParams(window.location.search),
        device: this.judgeDevice()
      };
      this.$axios({
        url: '/card/getInfoById',
        method: 'POST',
        data: {...info}
      }).then((res: any) => {
        if (res.result.vaild) {
         
      localStorage.setItem('info', JSON.stringify(info))
      this.$router.replace({
        path: "/card"
      });
        } else {
          Toast(res.message)
        }

      })
    }
    private judgeDevice () {
      if (hybrid_app.isAndroid()) {
        return 0
      }
      if (hybrid_app.isIPhone()) {
        return 1
      }
      return 2
    }
    private chooseCard() {
      this.show = true;
    }
    private onChange(picker: Vue, values: string) {
      // console.log('log', values);
    }
    private confirmType(obj: any) {
      this.cardTypeName = obj.name
      this.type = obj.id
      this.show = false;
    }
  }
</script>
<style lang="scss" scoped>
  .home {
    color: #191d24;
    font-size: $fontSize;
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    background: url("../../../assets/images/phone_bg.png") bottom center no-repeat;
    background-size: 100%;

    &__btn {
      display: block;
      margin: 0 auto 20px;
      width: calc(100% - 32px);
      font-size: 18px;
      background: #4680ff;
      height: 48px;
      line-height: 48px;
      color: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__list {
      padding-left: 16px;
      background: #fff;

      span {
        color: #666666;
      }

      >li {
        @include flex-between;
        height: 56px;
        padding-right: 16px;
        border-bottom: 1px solid #e7e9ed;

        &:last-of-type {
          border-bottom: none;
        }
      }

      &_icon {
        @include flex-col-center;

        img {
          display: inline-block;
          width: 18px;
          margin-left: 7px;
        }
      }

      &_blank {
        margin-top: 8px;
      }
    }

    &__desc {
      text-align: left;
      font-size: 14px;
      color: rgb(165, 165, 165);
      height: 40px;
      line-height: 40px;

      &_first {
        color: #fe422e;
        padding-left: 16px;
        font-style: normal;
      }
    }
  }
</style>