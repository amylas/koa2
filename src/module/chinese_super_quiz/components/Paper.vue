<template>
  <div class="paper">
    <header :style="'background-image: url('+headPic+')'">
      <h2 v-if="is_login">若您获奖后，将在3天内收到系统消息通知</h2>
      <h2 v-if="!is_login">参与成功后，请查看您的手机短信</h2>
    </header>
    <section class="main">
      <p class="share_tips" v-if="is_dqd_app">点击右下角分享，奖金翻倍</p>
      <div class="vs" v-for="(value, index) in result" v-if="value.key != '*'">
        <span class="fl">{{value.teamA}}</span>
        <em :class="value.key">{{winStr(value.value)}}</em>
        <span class="fr">{{value.teamB}}</span>
      </div>
      <a class="down-btn" v-on:click="downBtn" v-if="!is_dqd_app" href="https://m.dongdong.com/redirect?url=http://a.app.qq.com/o/simple.jsp?pkgname=com.dongdong.news&wz=zcjcxz">下载客户端，领取奖金</a>
      <a class="intr-more" v-if="is_dqd_app" href="dongdong:///circle/225">来中超竞猜圈晒单交流>></a>
      <a class="ad-link" v-bind:href="th_ad_link" v-if="id==57">下载天弘爱理财，送余额宝红包>>><em class="em-ad">广告</em></a>
    </section>
    <section class="ad" v-if="adList.url">
      <h2 class="title">大家都在玩<em class="em-ad">广告</em></h2>
      <ul>
        <li>
          <a v-on:click="adSend()" :href="adList.url + '?ad_number=3'">
            <img :src="adList.pic" width="50px" height="50px" class="pic">
            <p class="name">{{adList.content}}</p>
            <p class="desc">{{adList.desc}}</p>
            <img src="../assets/btn-download.png" width="65px" height="auto" class="down">
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    data () {
      return {
        result: [],
        headPic: "",
        adList:{},
        is_login: globalParams.Authorization,
        th_ad_link: "https://h5.tianhongjijin.com.cn/mail/app/promotions/register/index.html?activity=wenli2017&cardConfigId=20170605001&key=key1&sp=0&utm_source=voss&utm_medium=banner"
      }
    },
    beforeMount: function () {
      if(!globalParams.Authorization){

      }
      var mobile = this.$route.query.mobile;
      this.$http.get("activity/quiz/zhongchao/result/" + this.id + "?mobile=" + mobile).then(res => {
        Vue.set(this, "headPic", res.data.headPic);
        Vue.set(this, "result", res.data.result);
      },res =>{
        // error callback
      });
      this.$http.get("activity/quiz/zhongchao/ads?type=single").then(res => {
            Vue.set(this.adList,'content',res.data['content']);
            Vue.set(this.adList,'desc',res.data['desc'] || "");
            Vue.set(this.adList,'pic',res.data['pic']);
            Vue.set(this.adList,'url',res.data['url']);
      }, res => {
        // error callback
      });
    },
    created: function () {
    },
    mounted: function () {
      var me = this;
    },
    methods: {
      winStr: function (value) {
        return value == "A" ? "主胜" : value == "B" ? "平局" : value == "C" ? "客胜" : value
      },
      adSend: function(){
        (new Image()).src="http://stat.dongdong.com/zhongchao/ads?position=result";
      },
      downBtn(){
        (new Image()).src = "http://stat.dongdong.com/activity/zhongchao?key=click_download_zhongchao_" + this.id;
      },
      getQueryString(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)",
          "i"));
        if (result == null || result.length < 1) {
          return "";
        }
        return result[1];
      }
    }
  }
</script>

<style>
  .share_tips{
    font-size: 21px;
    color: #d64444;
    font-weight: 600;
    text-align: center;
  }
  .down-btn{
    display: block;
    width: 220px;
    height: 40px;
    margin: 10px auto 5px;
    border-radius: 20px;
    background: #d64444;
    color: #fff;
    font-size: 17px;
    line-height: 40px;
    text-align: center;
  }
  header {
    width: 100%;
    position: relative;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding-top: 40%;
  }

  .paper .main {
    border-radius: 6px;
    margin: 0 2.5% 2.5%;
    background: #fbf9ef;
  }

  .paper .vs {
    position: relative;
    overflow: auto;
    zoom: 1;
    margin: 13px auto 0;
  }

  .paper .vs em {
    text-align: center;
    width: 52px;
    line-height: 24px;
    font-size: 1.5rem;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -26px;
    border-radius: 13px;
  }

  .paper .vs .A {
    color: #f12b2b;
    border: 1px solid #f12b2b;
    font-weight: 800;
  }

  .paper .vs .B {
    color: #49c867;
    border: 1px solid #49c867;
    font-weight: 800;
  }

  .paper .vs .C {
    color: #1d9ff9;
    border: 1px solid #1d9ff9;
    font-weight: 800;
  }

  .paper .vs span {
    width: 38%;
    line-height: 26px;
    font-size: 15px;
    color: #333;
  }

  .paper .vs .fl {
    float: left;
    text-align: right;
  }

  .paper .vs .fr {
    float: right;
    text-align: left;
  }

  .paper .intr {
    color: #999;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    margin-top: 28px;
  }

  .paper .intr em {
    color: #e12c23;
  }

  .paper .intr-more {
    color: #e12c23;
    font-size: 12px;
    line-height: 44px;
    text-align: center;
    display: block;
    text-decoration: underline;
  }

  .paper .btn-share {
    display: block;
    width: 60%;
    height: 38px;
    line-height: 38px;
    border: 1px solid #d64444;
    margin: 0 auto;
    text-align: center;
    font-size: 17px;
    color: #d64444;
    border-radius: 19px;
  }

  .shareapp .dialog-main {
    background: url(../assets/bg-share-app.png);
    width: 128px;
    height: 115px;
    background-size: 100% auto;
    bottom: 30px;
    right: 30px;
    top: auto;
    left: auto;
    padding: 0;
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -moz-transform: translate(0, 0);
    -o-transform: translate(0, 0);
  }

  .link_extr{
    display: none;
    height: 15px;
    line-height: 15px;
    margin: 15px 0;
    color: #00ae32;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
  }
  .link_extr em{
    display: inline-block;
    color:#deb929;
    text-align: center;
    font-size: 10px;
    border:1px solid #deb929;
    line-height: 15px;
    height:15px;
    padding:0 4px;
    margin-left:4px;
    font-weight: 400;
  }
  .ad{
    padding:0;
    overflow: auto;
    height: auto;
  }
  .ad li{
    padding:4% 0;
    margin:0 4%;
    height: 50px;
    position: relative;
  }
  .ad li .pic{
    float: left;
    border-radius:25%;
  }
  .ad li a{
    display: block;
    height: 100%;
  }
  .ad li .name{
    margin:0 68px 0 60px;
    color:#333;
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 18px;
  }
  .ad li .desc{
    margin:0 68px 0 60px;
    color:#888;
    font-size: 12px;
    line-height: 18px;
  }
  .ad li .down{
    float: right;
    position: absolute;
    top:25px;
    right: 0;
  }
  .paper .ad-link{
    font-size: 15px;
    margin-top: 0;
  }
</style>
