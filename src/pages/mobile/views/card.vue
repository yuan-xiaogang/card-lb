<template>
  <div class="card">
    <div class="header">
      <p class="header__left" @click.stop="onClickLeft">
        <img src="@img/left-arrow.png" alt>
        <span>返回</span>
      </p>
      <span class="header__title">五山联名卡</span>
    </div>
    <section class="card__block">
      <div class="card__block_img">
        <img src="@img/card.png" alt>
        <div class="card__block_img-desc">
          <span>我的年卡状态</span>
          <span>{{status === 'activated' ? '已生效' : '未生效'}}</span>
        </div>
      </div>
    </section>
    <section class="card__block">
      <ul class="card__info">
        <li>
          <label>用户名称</label>
          <span>{{info.name}}</span>
        </li>
        <li>
          <label>生效时间</label>
          <span>{{status === 'activated' ? orderDate : '未确认'}}</span>
        </li>
        <li>
          <label>失效时间</label>
          <span>{{status === 'activated' ? expiringDate : '未确认'}}</span>
        </li>
        <li>
          <label>用户登记</label>
          <span>年票用户</span>
        </li>
      </ul>
    </section>
    <!-- <div v-if="status === 'activated'"> -->
    <div>
      <p class="card__desc">
        <em>*</em> 请完成人脸录入，确保入园成功
      </p>
      <div class="card__face" @click="getFaceImg">
        <span>人脸录入</span>
        <span class="card__face_right">
          {{hasFace ? '已录入': '未录入'}}
          <img src="@img/right-arrow.svg" alt v-if="!hasFace">
        </span>
        <input type="file" value="直接打开摄像头" accept="image/*" capture="camera" ref="file" style="display: none">
      </div>
    </div>
    <div v-if="showImage" class="showImage">
      <!-- <img :src="testBlob" alt="" style="display: inline-block; width: 100%;"> -->
      <vueCropper ref="cropper" :img="testBlob" :autoCrop="true" :info="true" :autoCropWidth="options.autoCropWidth"
        :autoCropHeight="options.autoCropHeight" :outputSize="0.7" :canMove="false"></vueCropper>
      <ul class="showImage__btn" v-if="!loading">
        <li @click="cacelImg">取消</li>
        <li @click="affirmImg">确定</li>
      </ul>
      <div class="showImage__loading" v-if="loading">
        <van-loading color='#1989fa' size="60px" />
      </div>
    </div>
    <div class="card__position" v-if="status === 'inactivated'">
      <p class="card__desc card__position_center">
        <em>*</em>使用联名卡付费享受95折优惠
      </p>
      <a href="javascript: void(0)" class="card__btn" @click="recharge">充值</a>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Vue
  } from "vue-property-decorator";
  import {
    Dialog,
    Toast,
    NavBar,
    Loading
  } from "vant";
  // import dealImage from '@/utils/dealImage.js';
  import {
    getUrlJson
  } from '@/utils/tools.js'
  import {
    MAINURL
  } from '@/config/index';
  import hybrid_app from '@/assets/js/hybrid_app.js';
  import EXIF from 'exif-js';
  import {
    VueCropper
  } from "vue-cropper"
  import OSS from 'ali-oss';
  @Component({
    components: {
      [NavBar.name]: NavBar,
      [Loading.name]: Loading,
      VueCropper
    }
  })
  export default class Card extends Vue {

    private status: string = "inactivated"; // activated
    private hasFace: boolean = false;
    private info: object = {};
    private orderDate: string = ''
    private expiringDate: string = ''
    private testBlob: any = null
    private Orientation: any = null
    private showImage: boolean = false
    private loading: boolean = false
    private client: any = null

    private options: any = {
      autoCropWidth: 375,
      autoCropHeight: 375
    }
    /**
     * name
     */
    public mounted() {

      if (window.location.href.includes('result')) {
        this.respondOrderStatus();
      } else {
        this.initCard();
      }
      this.options = {
        autoCropWidth: window.screen.availWidth,
        autoCropHeight: window.screen.availWidth
      }

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.onClickLeft, false); //false阻止默认事件
      }

      this.client = new OSS({
        region: 'http://oss-cn-hangzhou.aliyuncs.com',
        accessKeyId: 'ZNrCcGVKMR7fIry1',
        accessKeySecret: 'j5KPlUXTzO4oiBX83aWMdfXcYmQYTP',
        bucket: 'lvboyuan-card'
      });

    }
    public destroyed() {
      window.removeEventListener('popstate', this.onClickLeft, false)
    }
    private onClickLeft() {
      hybrid_app.back();
      // this.$router.push({name: 'home'});
    }
    private respondOrderStatus() {
      const json = getUrlJson(window.location.href);
      let self = this;
      if (localStorage.getItem('info')) {
        self.info = JSON.parse((localStorage.getItem('info') as string));
      }
      this.$axios({
        url: '/card/payResult',
        method: 'POST',
        data: json
      }).then((res: any) => {
        if (res.success) {
          if (res.result.result) {
            switch (res.result.result) {
              case '1':
                self.status = "activated";
                Toast('支付成功');
                break;
              case '2':
                Toast('取消支付');
                break;
              case '3':
                Toast('支付失败');
                break;
              case '4':
                Toast('支付处理中');
                break;
              default:
                break;
            }
          }
          if (self.status === 'activated') {
            self.$set(self.info, 'name', res.result.name);
            self.orderDate = res.result.orderDate
            self.expiringDate = res.result.expiringDate
            self.hasFace = res.result.ifEnter === 1 ? true : false
          }

        }
      })
    }
    private initCard() {
      let self = this;
      if (localStorage.getItem('info')) {
        self.info = JSON.parse((localStorage.getItem('info') as string));
        this.$axios({
          url: "/card/getCardInfo",
          params: {
            identityCard: (self.info as any).identityCard,
            telPhone: (self.info as any).telphone,
          }
        }).then((res: any) => {
          //  alert(res.result+'initcard')
          if (res.success) {
            if (res.result === null) {
              self.status = "inactivated";
            } else {
              self.status = "activated";
              self.hasFace = res.result.ifEnter === 1 ? true : false
              self.orderDate = res.result.orderDate
              self.expiringDate = res.result.expiringDate
            }
          }
        });
      }
    }
    private getFaceImg() {
      let file: any = null;
      file = this.$refs.file;
      const self = this;
      self.loading = false;
      // todo
      if (self.hasFace) {
        return
      }
      Dialog.alert({
        message: "请确保人脸清晰后完成录入操作"
      }).then(() => {
        file.click();
        Dialog.close();
        file.onchange = (e: any) => {
          const fileList = e.target.files
          if (fileList.length === 0) return
          EXIF.getData(fileList[0], function () {
            let Orientation = EXIF.getTag(this, 'Orientation');
            self.Orientation = Orientation || -1;
            let reader = new FileReader()
            reader.onload = function (e: any) {
              self.testBlob = e.target.result;
              self.showImage = true
            }
            reader.readAsDataURL(fileList[0]);
          });
        };
      });
    }
    private affirmImg() {
      const self = this;
      const cropper: any = this.$refs.cropper;
      cropper.getCropBlob(async (data: any) => {
        console.log(this.client);
        try {
          let result = await this.client.put('object-key', new Blob(['content'],{ type: 'text/plain' }));
          console.log(result, 'result');
        } catch (error) {
          console.log(error);
          
        }
        
        
        
        // const formdata: any = new FormData();
        // formdata.append('file', data);
        // formdata.append('request', JSON.stringify({
        //   identityCard: (self.info as any).identityCard,
        //   orientation: self.Orientation
        // }));
        // self.loading = true;
        // self.$axios({
        //   url: '/card/faceIn',
        //   method: 'POST',
        //   data: formdata
        // }).then((res: any) => {
        //   self.loading = false;
        //   if (res.success) {
        //     self.hasFace = true;
        //     Toast.success('人脸录入成功');
        //     self.showImage = false;
        //     self.testBlob = null;
        //   } else {
        //     Toast.fail(res.message);
        //   }
        // }).catch(() => {
        //   self.loading = false;
        // })
      })
    }
    private cacelImg() {
      this.showImage = false;
      this.testBlob = null;
    }
    private recharge() {
      // 请求充值接口
      // 添加客户信息
      const self = this;
      let params = []
      for (let key in self.info) {
        let str: any = `${key}=${(self.info as any)[key]}`
        params.push(str)
      }
      window.location.href = `${MAINURL}/card/createRecord?${params.join('&')}`
    }
  }
</script>

<style lang="scss" scoped>
  $font: 14px; // 字体大小

  .card {
    font-size: $font;
    height: 100vh;
    position: relative;

    &__position {
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;

      .card__position_center {
        text-align: center;
        margin-bottom: 10px;
      }
    }

    &__btn {
      height: 48px;
      line-height: 48px;
      color: #ffffff;
      font-size: 18px;
      // width: 100%;
      display: block;
      width: calc(100% - 32px);
      font-size: 18px;
      background: #4680ff;
      margin: 0 auto;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__block {
      overflow: hidden;
      margin: 0 8px 8px;
      border-radius: 12px;

      img {
        display: inline-block;
        width: 100%;
      }

      &_img {
        position: relative;

        &-desc {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 9;
          font-size: $fontSize;
          color: #ffffff;
          padding: 16px;
          @include flex-between;
        }
      }
    }

    &__info {
      background: #ffffff;
      padding: 12px 16px;

      >li {
        @include flex-between;
        line-height: 28px;

        label {
          color: #191d24;
        }

        span {
          color: #a6a6ae;
        }
      }
    }

    &__desc {
      font-size: 14px;
      color: rgb(138, 138, 138);
      text-align: left;
      padding-left: 24px;
      margin: 34px 0 10px;

      em {
        font-style: normal;
        color: rgb(236, 94, 79);
      }
    }

    &__face {
      @include flex-between;
      height: 56px;
      background: #ffffff;
      margin: 0 8px;
      padding: 0 16px;
      border-radius: 12px;
      font-size: $fontSize;
      color: #191d24;

      &_right {
        @include flex-col-center;
        color: #a6a6ae;
        font-size: $font;
      }

      img {
        display: inline-block;
        width: 18px;
        margin-left: 7px;
      }
    }
  }

  .showImage {
    position: absolute;
    // display: flex;
    // align-items: center;
    background: rgba($color: #000000, $alpha: 1);
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    &__loading {
      z-index: 13;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      opacity: 0.5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__btn {
      position: absolute;
      z-index: 11;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      bottom: 45px;
      color: #fff;
      width: 100%;
      font-size: 16px;

      >li {
        background: #4680ff;
        padding: 6px 16px;
        margin-left: 18%;
        border-radius: 16px;
        letter-spacing: 2px;

        &:first-of-type {
          margin-left: 0;
          background: #fff;
          // border: 1px solid #4680ff;
          color: #4680ff;
        }
      }
    }
  }
</style>