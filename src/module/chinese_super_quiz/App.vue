<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    created: function () {
       var me = this;
       document.body.addEventListener("click", function () {
         if (!me.is_dqd_app) {
           var last_dialog = document.body.lastElementChild;
           if (last_dialog.classList.contains("dialog") && last_dialog.style.display == "block") {
             return;
           }
           let args = {
             type: "alert share",
             title: "",
             close_show: 1,
             confirm_show: 1,
             confirm_value: "立即下载参与竞猜"
           };
           var _dialog = me.$dialog.fn(args);
           (new Image()).src = "http://stat.dongdong.com/activity/zhongchao?key=show_download_zhongchao_" + me.id;
           _dialog.el.addEventListener("click",function (ev) {
             _dialog.hide();
             ev.stopPropagation();
           });
           _dialog.el.querySelector(".dialog-main").addEventListener("click",function (ev) {
             (new Image()).src = "http://stat.dongdong.com/activity/zhongchao?key=click_download_zhongchao_" + me.id;
             location.href="https://m.dongdong.com/redirect?url=http://a.app.qq.com/o/simple.jsp?pkgname=com.dongdong.news&wz=zcjcxz"
             ev.stopPropagation();
             return;
           });
           _dialog.el.querySelector(".dialog-main-close").addEventListener("click",function (ev) {
             _dialog.hide();
             ev.stopPropagation();
           })
         }
       },false);
    }
  }
</script>

<style>
  @import "../dqd.dialog/dqd.dialog.css";
  h1,h2,h3,h4,p{margin: 0; padding: 0;}
  ul,ol,li,dl,dt,dd{margin:0; padding: 0; list-style: none;}
  a{text-decoration: none;}
  em,i{font-style: normal}
  html{
    font-size:62.5%;
    width: 100%;
    min-height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-touch-callout: none;
    font-family:'PingFang SC', "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    user-select: none;
    color: #fff;
    width: 100%;
    min-height: 100%;
    background: #e0241a url(assets/bg_top.jpg) top center no-repeat;
    background-size: 100% auto;
  }
  .w{color: #f12b2b}
  .d{color: #49c867}
  .l{color: #1d9ff9}
</style>
