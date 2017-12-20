<template>
  <div>
    <header :style="'background-image: url('+headPic+')'">
    </header>
    <article class="main">
      <h1>目前共<span>{{user_total}}</span>人参与<router-link v-if="flag" to="/paper" class="check_mine">查看我的竞猜>></router-link></h1>
      <div class="con suggest">
        <h2><img src="../assets/title_1.png"></h2>
        <dl v-for="(list, index) in content.recom">
          <dt><img class="head" :src="list.avatar" alt="">
            {{list.name}} <i>({{list.desc}})</i>
            <span class="btn_1" v-on:click="submit(index)"
            :class="{'disable-choose': Date.parse(new Date(content.question[2].end_time.replace(/-/g,'/'))) < today_time}">一键跟单</span>
          </dt>
          <dd>
            <div class="lists">
              {{list.intro}}
            </div>
          </dd>
        </dl>
      </div>
      <div class="con selection">
        <dl v-for="(question, index) in content.question">
          <h2 v-if="question.type ==2 && index==0 || question.type ==2 && index==3" class="title"><img src="../assets/title_2.png">
            <a id="que2">比赛开始前结束</a>
          </h2>
          <h2 v-if="question.type ==1 && index==0 || question.type ==1 && index==2 && content.question[3].type ==1" class="title"><img src="../assets/title_3.png">
            <a>{{question.end_time}}截止</a>
          </h2>
          <dt>
            <span class="teamA">{{question.teamA}}</span>
            <span class="vs">VS</span>
            <span class="teamB">{{question.teamB}}</span>
          </dt>
          <dd v-if="question.type == '2'">
            <span class="btn_2" :class="{'disable-choose': Date.parse(new Date(question.end_time.replace(/-/g,'/'))) < today_time}" v-on:click="chooseVS(index,$event,false,question.end_time)">选择比分</span>
          </dd>
          <dd v-if="question.type == '2'" class="que2_endTime">
            <span v-if="Date.parse(new Date(question.end_time.replace(/-/g,'/'))) < today_time">已截止</span>
            <span v-else>{{question.end_time}}截止</span>
          </dd>
          <dd v-else>
            <div class="select_list" :class="{'disable-choose': Date.parse(new Date(question.end_time.replace(/-/g,'/'))) < today_time}">
              <span v-on:click="chooseVS(index,$event,'A',question.end_time)">
                {{question.answer.A}}</span>
              <span v-on:click="chooseVS(index,$event,'B',question.end_time)">
                {{question.answer.B}}</span>
              <span v-on:click="chooseVS(index,$event,'C',question.end_time)">
                {{question.answer.C}}</span>
            </div>
            <table class="odds">
              <tr v-for="item in question.odds">
                <td>{{item.name}}</td>
                <td>{{item.A}}</td>
                <td>{{item.B}}</td>
                <td>{{item.C}}</td>
              </tr>
              <tr v-if="index == 0 || index == 2 && content.question[3].type ==1" class="odds_tips">
                <td colspan="4">
                  <a href="dongdong:///news/289646"><span class="bg_q">?</span> 怎么参考赔率&gt;&gt;</a>
                </td>
              </tr>
            </table>
          </dd>

        </dl>
      </div>
      <a href="javascript:void(0)" class="btn_send" v-on:click="submit(-1)"><img src="../assets/btn_send.png" alt=""></a>
      <a class="ad-link" v-bind:href="th_ad_link" v-show="id==57">下载天弘爱理财，送余额宝红包>>><em class="em-ad">广告</em></a>
    </article>
    <section class="prize">
      <h2>奖品明细</h2>
      <p v-html="rule"></p><br>
      <h2>活动规则和免责声明</h2>
      <p v-html="announce" v-bind:class="'show-' + showAllNotice"></p>
      <p v-bind:class="'icon-' + showAllNotice" v-on:click="showNotice"><span class="icon_trigle"></span></p>
    </section>

    <section class="ad-list" v-if="adList.length>0">
      <h2 class="title">大家都在玩<em class="em-ad">广告</em></h2>
      <ul>
        <li v-for="(item, index) in adList">
          <a v-on:click="adSend(index)" :href="'dongdong:///url/'+item.url+'?ad_number='+index " >
          <img :src="item.pic">
          <p class="ad-list-content">{{item.content}}</p>
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
        status: 1,
        headPic: "",
        rule: "",
        announce: "",
        content: {},
        user_total: 0,
        articleId: 0,
        end_time:"",
        selected_data: [],
        flag:0,
        showAllNotice: 0,
        adList:[],
        que1_endTime:'',
        today_time: Date.parse(new Date()),
        que2_height: '',
        selected_len: 5,
        th_ad_link: ""
      }
    },
    mounted: function(){
    },
    beforeMount: function () {
        var log_params ={
            uuid:globalParams.UUID,
            token:globalParams.Authorization,
            toString:function () {
              return 'uuid='+this.uuid+"&token="+this.token;
            }
        };
      this.$http.get("activity/quiz/zhongchao/"+this.id).then(res => {
        //访问次数打点
        (new Image()).src="http://stat.dongdong.com/zhongchao/"+this.id+"/visited?"+log_params.toString();
        Vue.set(this,"headPic",res.data.headPic);
        Vue.set(this,"rule",res.data.rule);
        Vue.set(this,"announce",res.data.announce);
        Vue.set(this,"content",res.data.content);
        if(globalParams.UUID){
          Vue.set(this,"th_ad_link","dongdong:///url/https://h5.tianhongjijin.com.cn/mail/app/promotions/register/index.html?activity=wenli2017&cardConfigId=20170605001&key=key1&sp=0&utm_source=voss&utm_medium=banner")
        }else {
          Vue.set(this,"th_ad_link","https://h5.tianhongjijin.com.cn/mail/app/promotions/register/index.html?activity=wenli2017&cardConfigId=20170605001&key=key1&sp=0&utm_source=voss&utm_medium=banner")
        }
        Vue.set(this,"user_total",res.data.user_total);
        Vue.set(this,"end_time",res.data.end_time);
        Vue.set(this,"flag",res.data.flag || 0);
        Vue.set(this,"que1_endTime",res.data.content.question[0].end_time);
        if(Date.parse(new Date(this.que1_endTime.replace(/-/g,'/')))<Date.parse(new Date())){ }
        }, res => {
            this.$dialog.tip(res.data.errMsg);
        });
      this.$http.get("activity/quiz/zhongchao/ads?type=multi").then(res => {
        if(res.data.length > 0){
          for(let i=0,len=res.data.length;i<len;i++){
            Vue.set(this.adList,i,res.data[i]);
          }
        }
      }, res => {
        // error callback
      });
    },
    computed: {},
    methods: {
      adSend: function (index) {
        index = index + 1;
        (new Image()).src="http://stat.dongdong.com/zhongchao/ads?position=index"+index;
      },
      showNotice: function () {
        this.showAllNotice = 1 - this.showAllNotice;
      },
      submit: function (index) {
        var end = this.content.question[2].end_time;
        if(index != -1){
          if (Date.parse(new Date(end.replace(/-/g,'/'))) < Date.parse(new Date())) {return;}
        }
        var max_endtime = 0;
        this.content.question.map(function(val,index){
          if(max_endtime <= Date.parse(new Date(val.end_time.replace(/-/g,'/')))){
            max_endtime = Date.parse(new Date(val.end_time.replace(/-/g,'/')));
          }
        })
        if(max_endtime < Date.parse(new Date())){
          this.$dialog.tip("本期活动已截止~");
          return;
        }
        // if (!this.is_dqd_app) {return;}
        var selected_data = this.selected_data;
        var data = this.content.question;
        if (index > -1) {
          selected_data = this.content.recom[index].choice;
        }
        if(!selected_data.length) {
          this.$dialog.tip("您未进行任何选择～");
            return;
        }
        var end_time_arr = this.content.question
        var count = 0;
        for(var i=0; i<end_time_arr.length; i++){
          if(Date.parse(new Date(end_time_arr[i].end_time.replace(/-/g,'/'))) > Date.parse(new Date())){
            count++;
          }
        }
        Vue.set(this,"selected_len",count)
        var sele_count = 0;
        for(var i=0; i<selected_data.length; i++){
          if(selected_data[i]){
            sele_count++;
          }
        }
        if(sele_count<count) {
          this.$dialog.tip("您有空的选择哦～");
          return;
        }
        // for (let i = 0, len = selected_data.length; i < len; i++) {
        //   if (!selected_data[i]) {
        //     this.$dialog.tip("您有空的选择哦1～");
        //     return;
        //   }
        // }
        var _data = selected_data.map(function (value, index) {
          value.teamA = data[index].teamA;
          value.teamB = data[index].teamB;
          return value;
        });
        var log_params ={
            uuid:globalParams.UUID,
            token:globalParams.Authorization,
            toString:function () {
              return 'uuid='+this.uuid+"&token="+this.token;
            }
        };
        if (index > -1) {
          // 	一键跟单点击数
          (new Image()).src="http://stat.dongdong.com/zhongchao/"+this.id+"/shortcut?"+log_params.toString();
        }else{
          // 提交答案按钮点击数
          (new Image()).src="http://stat.dongdong.com/zhongchao/"+this.id+"/pre_submit?"+log_params.toString();
        }
        var new_data = [];
        for(var i=0; i<_data.length; i++){
          if(_data[i]){
            if(_data[i].key != '*'){
              new_data.push(_data[i])
            }
          }
        }

        // 如果用户未登录
        // if(true){
        if(!globalParams.Authorization){
          var me = this;
          let args = {
            type: "alert",
            title: "您的手机号是领奖的凭证",
            content: ` <div class="dialog-paper">
              <ul class="contect_li">
                <li><span class="phone_head">中国 +86</span><input class="contect_phone" type="phone" placeholder="手机号" ondragenter="return false" style:ime-mode:disabled="" onpaste="return false" oncontextmenu="return false"></input></li>
                <li><input type="phone" placeholder="填写验证码" class="phone_code" style:ime-mode:disabled="" onpaste="return true" oncontextmenu="return false"></input><span class="code_button">发送验证码</span></li>
              </ul>
            </div>`,
            close_show: 1,
            confirm_show: 1,
            confirmCb: function () {
              (new Image()).src="http://stat.dongdong.com/zhongchao/"+ me.id +"/submit?"+log_params.toString();
              if (!contect_phone.value) {
                me.$dialog.tip("手机号码不能为空");
                console.LOG()
              }else if(!/^1[34578]\d{9}$/.test(contect_phone.value)){
                me.$dialog.tip("手机号码格式有误");
                console.LOG()
              }else if (!/\d/.test(phone_code.value)) {
                me.$dialog.tip("验证码错误");
                console.LOG()
              }else {
                me.confirmSubmit(selected_data,contect_phone.value,phone_code.value,index)
              }
            },
            confirm_value: "完成"
          };
          var _dialog = this.$dialog.fn(args);
          var code_button = _dialog.el.querySelector(".code_button");
          var contect_phone = _dialog.el.querySelector(".contect_phone");
          var phone_code = _dialog.el.querySelector(".phone_code");
          window.contect_phone_val = contect_phone.value;
          // 发送验证按钮开关
          var code_button_tog = false;
          contect_phone.addEventListener("keydown",function(e){
            var event = e || window.event;
            var keycode = event.keyCode;
            var length = this.value.length;
            // 超过11位改变发送按钮样式
            if(length >= 10){
              code_button.className = 'code_button code_button_act';
              code_button_tog = true;
            }
            if(length >= 11 && keycode != 8){
              event.returnValue=false;
              return;
            }
            if ((keycode <= 57 && keycode >= 48) || (keycode <= 105 && keycode >= 96) || (keycode== 8)){
              event.returnValue=true;
            } else {
              event.returnValue=false;
            }
          })
          contect_phone.addEventListener('input',function(e){
            var numberRE = /[^\d]/g;
            if(this.value.length<11){
              code_button.className = 'code_button';
              if(numberRE.test(this.value)){
                this.value=this.value.replace(/\D/g,'')
              }
            }
          })

          // 发送验证按钮
          code_button.addEventListener('click',function(){
            if(!code_button_tog){
              return;
            }
            if(!/^1[34578]\d{9}$/.test(contect_phone.value)){
              me.$dialog.tip("手机号码格式有误");
            }else {
              var send_code_data = {"mobile":contect_phone.value};
              me.$http.post(globalParams.apiDomain + "/activity/quiz/zhongchao/send_code/"+me.id,send_code_data).then(res=>{
                if(res.data.errCode == 0){
                  this.innerHTML = "60s";
                  settime();
                  me.$dialog.tip(res.data.errMsg);
                }else {
                  me.$dialog.tip(res.data.errMsg);
                }
                (new Image()).src="http://stat.dongdong.com/zhongchao/"+ me.id +"/send_code_suc?"+log_params.toString()+"&errCode="+res.data.errCode;
              },err=>{
                me.$dialog.tip("服务器出小差了")
              })
            }
          })
          // 验证码
          phone_code.addEventListener("keydown",function(e){
            var event = e || window.event;
            var keycode = event.keyCode;
            var length = this.value.length;
            if(length >= 6 && keycode != 8){
              event.returnValue=false;
              return;
            }

            if ((keycode <= 57 && keycode >= 48) || (keycode <= 105 && keycode >= 96) || (keycode== 8)){
              event.returnValue=true;
            } else {
              event.returnValue=false;
            }
          })
          phone_code.addEventListener("input",function(e){
            var numberRE = /[^\d]/g;
            if(this.value.length<11){
              if(numberRE.test(this.value)){
                this.value=this.value.replace(/\D/g,'')
              }
            }
          })
          // 倒计时
          function settime(){
            code_button_tog = false;
            var mtime = 60;
            function loop(){
              mtime--;
              code_button.innerHTML = `${mtime}s`;
              if(mtime <= 0){
                clearInterval(time1);
                code_button.innerHTML = `${mtime}s`;
                code_button.innerHTML = "发送验证码";
                code_button_tog = true;
              }
              return mtime;
            };
            var time1 = setInterval(loop,1000)
          }
          return;
        }
        // 用户已登录
        var me = this;
        let args = {
          type: "alert",
          title: "确认选择",
          content: ` <div class="dialog-paper">
${new_data.map(x => `<div class="vs"><span class="fl">${x.teamA}</span><em class="${x.key}">${x.value == "A" ? "胜" : x.value == "B" ? "平" : x.value == "C" ? "负" : x.value}</em><span class="fr">${x.teamB}</span></div>`).join("")}
          </div>`,
          close_show: 1,
          confirm_show: 1,
          confirmCb: function () {
            (new Image()).src="http://stat.dongdong.com/zhongchao/"+ me.id +"/submit?"+log_params.toString();
            me.confirmSubmit(selected_data,'','',index)
          },
          confirm_value: "提交选择"
        };
        this.$dialog.fn(args);
      },
      confirmSubmit: function (data,mobile,code,is_follow) {
        var tempdata = [];
        data.map(function(val,index){
          tempdata.push(val)
        })
        function setData(data) {
          if(data.length == 2){
            data.unshift({key:'*',value:"*"},{key:'*',value:"*"},{key:'*',value:"*"});
          }else if (data.length == 1) {
            data.unshift({key:'*',value:"*"},{key:'*',value:"*"},{key:'*',value:"*"},{key:'*',value:"*"});
          }
          for (var i = 0; i < data.length; i++) {
            if(!data[i]){
              data[i] = {};
              data[i].key = '*';
              data[i].value = '*';
            }
          }
          return data
        }
        let me = this;
        var sub_data = {
          answer:setData(tempdata)
        };
        if(mobile || code){
          sub_data.mobile = mobile;
          sub_data.code = code;
        }
        var log_params2 ={
            uuid:globalParams.UUID,
            token:globalParams.Authorization,
            toString:function () {
              return 'uuid='+this.uuid+"&token="+this.token;
            }
        };
        // 提交答案接口
        this.$http.post("activity/quiz/zhongchao/submit/" + this.id,sub_data).then(res => {
          // localStorage.removeItem("zhongchaoData");
          if(res.data.errCode === 0){
            me.$dialog.tip("参与成功");
            // if(mobile){
            //   localStorage.setItem("zhongchaoMobile",mobile);
            // }
            // me.$router.push({ name: 'paper',path:'paper'});
            me.$router.push({ name: 'paper',path:'paper','query': {'mobile': mobile}});
            if(is_follow>-1){
              // 一键跟单提交成功数
              (new Image()).src="http://stat.dongdong.com/zhongchao/"+ me.id +"/shortcut_suc?"+log_params2.toString();
            }

          }else {
            me.$dialog.tip(res.data.errMsg);
          }
          // 提交成功数
          (new Image()).src="http://stat.dongdong.com/zhongchao/"+ me.id +"/submit_suc?"+log_params2.toString()+"&errCode="+res.data.errCode
        }, res => {
          me.$dialog.tip("服务器出小差了");
        });

      },
      chooseVS: function (index, event, value, end_time) {
        // 超过截止时间禁止点击
        if (Date.parse(new Date(end_time.replace(/-/g,'/'))) < Date.parse(new Date())) {return;}
        // if (!this.is_dqd_app) {return;}
        if (value) {//胜平负
          this.selected_data[index] = {
            key: value,
            value: value
          }
          let el = event.target;
          var pre_el = el.parentNode.querySelector('.selected');
          if (pre_el) {
            pre_el.classList.remove("selected");
          }
          el.className = "selected";
        } else {//比分
          var qustion = this.content.question[index]
          var title = qustion.teamA + " VS " + qustion.teamB
          var options = qustion.odds;
          var me = this;
          var old_value = this.selected_data[index]&&this.selected_data[index].value;
          let args = {
            type: "vs",
            title: title,
            content: `
                <div class="dialog-vs-type win">
                  <span class="title">胜</span><div>
                  ${options.A.map(function (x) {
              return `<span data-key="A" data-value="${x.key}" class="${old_value == x.key? 'selected':''}">${x.key}<em>${x.value}</em></span>`;
            }).join("")}
                </div></div>
                <div class="dialog-vs-type draw">
                  <span class="title">平</span><div>
                  ${options.B.map(function (x) {
              return `<span data-key="B" data-value="${x.key}" class="${old_value == x.key? 'selected':''}">${x.key}<em>${x.value}</em></span>`;
            }).join("")}
                </div></div>
                <div class="dialog-vs-type lose">
                  <span class="title">负</span><div>
                  ${options.C.map(function (x) {
              return `<span data-key="C" data-value="${x.key}" class="${old_value == x.key? 'selected':''}">${x.key}<em>${x.value}</em></span>`;
            }).join("")}
                </div></div>
                <span class="com">* 初赔赔率来自<em>ManBetX</em></span>
                <a class="dialog-main-btn btn-cancel" >取消</a>
                <a class="dialog-main-btn btn-confirm" >确定</a>`,
            close_show: 0,
            confirm_show: 0,
            confirm_value: "我知道了"
          };
          var _dialog = this.$dialog.fn(args);
          var selected_value = null;
          var btnConfirm = _dialog.el.querySelector('.btn-confirm');
          btnConfirm.addEventListener("click", function () {
            if (selected_value) {
              me.selected_data[index] = selected_value;
              var el = event.target;
              el.classList.add("selected");
              el.innerHTML = selected_value.value;
            }
            _dialog.hide();
          });

          _dialog.el.addEventListener("click", function (ev) {
            var el = null;
            if (ev.target.tagName == "SPAN" && ev.target.dataset["key"]) {
              el = ev.target;
            } else if (ev.target.parentElement && ev.target.parentElement.tagName == "SPAN" && ev.target.parentElement.dataset["key"]) {
              el = ev.target.parentElement;
            }
            if (el) {
              var pre_el = _dialog.el.querySelector(".selected");
              if (pre_el) {
                pre_el.classList.remove("selected");
              }
              el.classList.add("selected");
              selected_value = {
                key: el.dataset["key"],
                value: el.dataset["value"]
              }
            }
          });
        }

      }

    }
  }
</script>

<style>
  .contect_li>li{
    margin-top: 4px;
    height: 43px;
    border-bottom: 1px solid #8c9399;
    line-height: 43px;
    font-size: 13px;
    color: #333;
  }
  .contect_li input{
    border: 0;
    height: 30px;
    width: 60%;
    text-indent: 10px;
    outline: none;
    ime-mode: disabled;
  }
  .contect_li li:nth-of-type(2) input{
    text-indent: 0;
  }
  .contect_li .phone_head{
    border-right: 1px solid #8c9399;
    padding-right: 10px;
  }
  .code_button{
    float: right;
    width: 65px;
    text-align: center;
    background: #a2e0b0;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    height: 25px;
    line-height: 25px;
    margin-top: 6px;
  }
  .code_button.code_button_act{
    background: #00ae32;
  }
  header {
    width: 100%;
    position: relative;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding-top:40%;
  }
  .check_mine{
    color:#00ae32;
    font-size: 13px;
  }
  .check_mine:before {
    content: "，";
    color: #333;
    font-size: 14px;
  }

  .btn_1 {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding: 0 14px;
    border:1px solid #e2281f;
    color:#e2281f;
    background: #fff;
    border-radius: 5px;
    font-size: 14px;
    float: right;
    position: absolute;
    right: 0;
  }
  .btn_1.disable-choose{
    border: 1px solid #999;
    color: #999;
  }
  .btn_2 {
    display: block;
    height: 30px;
    width: 100%;
    line-height: 30px;
    text-align: center;
    background: #fff;
    color: #e2281f;
    border-radius: 5px;
    font-size: 14px;
    border: 1px solid #e2281f
  }
  .btn_2.disable-choose{
    border: 1px solid #999;
    color: #999;
  }
  .que2_endTime{
    color: #999;
    text-align: center;
  }

  .btn_2.selected {
    background: #e2281f;
    color: #fff;
  }
  dd{
    margin-bottom:10px;
  }
  header img {
    width: 100%
  }

  header h2 {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 5px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }

  article, section {
    margin: 2.5% ;
    background: #fbf9ef;
    padding: 14px 16px 16px;
    border-radius: 5px;
    color: #333;
  }

  article h1 {
    height: 30px;
    line-height: 30px;
    padding-bottom: 8px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid #e6e3d4
  }

  article h1 span {
    font-size: 18px;
    font-weight: 400;
    font-family: sans-serif;
    color: #e2271e
  }

  article .con h2 {
    margin: 10px 0 8px -16px;
  }

  article .con h2 img {
    height: 24px;
  }

  article .head {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    vertical-align: middle;
    margin-top: -2px;
  }


  article .suggest dt {
    line-height: 30px;
    font-size: 14px;
    position: relative;
  }

  article .suggest dt i {
    color: #999;
    font-size: 1rem;
  }
  .lists {
    line-height: 34px;
    margin: 0 0 10px 0;
    border-bottom: 1px solid #e6e3d4;
    overflow: visible;
    color: #555;
    font-size: 1rem;
  }

  span.teamA,span.teamB {
    display: inline-block;
    width: 40%
  }
  span.teamA{
    text-align: right;
  }
  span.teamB{
    text-align: left;
  }
  span.vs{
    width: 14%;
    text-align: center;
    display: inline-block;
  }
  .selection dl {
    padding: 0 5px 10px 5px;
    border-bottom: 1px solid #e6e3d4
  }
  .selection dl h2{
    margin-left: -21px;
  }
  .selection dt {
    text-align: center;
    height: 40px;
    margin-top: 5px;
    line-height: 40px;
    font-size: 16px;
  }

  .selection .select_list {
    text-align: center;
  }

  .select_list span {
    display: inline-block;
    width: 30%;
    border: 1px solid #d64444;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #d64444;
    border-radius: 5px;
    background: #fff;
    text-align: center;
    text-align-last: auto;
    -webkit-text-align-last: auto;
    -moz-text-align-last: auto;
    -o-text-align-last: auto;
  }

  .select_list.disable-choose span:nth-child(1),.select_list.disable-choose span:nth-child(2),.select_list.disable-choose span:nth-child(3){
    border:1px solid #999;
    color: #999;
  }
  .select_list span:nth-child(1) {
    border: 1px solid #d64444;
    color: #d64444;
    float: left;
  }

  .select_list span:nth-child(1).selected {
    background: #d64444;
    color: #fff;
  }

  .select_list span:nth-child(2) {
    border: 1px solid #49c867;
    color: #49c867;
  }

  .select_list span:nth-child(2).selected {
    background: #49c867;
    color: #fff;
  }

  .select_list span:nth-child(3) {
    border: 1px solid #1d9ff9;
    color: #1d9ff9;
    float: right;
  }

  .select_list span:nth-child(3).selected {
    background: #1d9ff9;
    color: #fff;
  }

  table.odds {
    width: 100%;
    border: 0;
    margin: 10px auto;
    border-spacing: 0;
    text-align: center;
    border-collapse: collapse;
  }

  table.odds td {
    background: #e6e3d4;
    color: #333;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
  }
  table.odds td:first-child{
    width: 25%;
    white-space: nowrap;
    overflow: hidden;
    word-break: keep-all;
    text-overflow: ellipsis;
    padding: 0 6px;
  }
  table.odds tr:nth-of-type(2) td{
    border-top: 1px solid #fbf9ef;
  }
  table.odds tr:nth-last-child(1) td {
    border-top: 1px solid #fbf9ef;
  }
  .odds_tips>td>a{
    display: block;
    width: 135px;
    color: #00ae32;
    margin: 0 auto;
  }
  .btn_send {
    display: block;
    margin: 25px 5px 10px 5px;
  }

  .btn_send img {
    width: 100%
  }
  section h2 {
    text-align: left;
    font-size: 16px;
    color: #2393e2;
    line-height: 32px;
  }

  section p {
    line-height: 20px;
  }

  h2.title a {
    float: right;
    margin-top:3px;
    color: #999;
    font-weight: lighter;
    font-size: 12px;
  }

  .bg_q {
    width: 12px;
    height: 12px;
    line-height: 12px;
    vertical-align: middle;
    font-family: 'monospace';
    display: inline-block;
    font-size: 10px;
    border: 1px solid #00ae32;
    border-radius: 8px;
    color: #00ae32;
    text-align: center
  }

  .dialog-vs .dialog-main {
    bottom: 0;
    top: auto;
    border-radius: 0;
    width: 100%;
    -ms-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
    padding-bottom: 0
  }

  .dialog-vs .dialog-main-cnt {
    border-top: 1px solid #eee;
  }

  .dialog-vs-type {
    overflow: auto;
    zoom: 1;
    width: 85%;
    margin: 3% auto;
    padding-left: 9%;
    position: relative;
  }

  .dialog-vs-type span.title {
    width: 4%;
    background: #fcd5d5;
    height: 100%;
    line-height: 1;
    font-size: 1.1rem;
    padding: 0 2%;
    position: absolute;
    left: 0;
    border: 0;
    margin: 0;
    color: #f12b2b;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    -webkit-box-orient: vertical;
    text-align: center;
  }

  .dialog-vs-type.draw span.title {
    background: #dbf4e1;
    color: #49c867;
  }

  .dialog-vs-type.lose span.title {
    background: #d2ecfe;
    color: #1d9ff9;
  }

  .dialog-vs-type div {
    overflow: auto;
    zoom: 1;
    margin-bottom:-6px;
  }

  .dialog-vs-type span {
    border: 1px solid #adadad;
    height: 32px;
    width: 17%;
    text-align: center;
    display: inline-block;
    margin: 0 0 6px 2%;
    float: left;
    line-height: 15px;
    font-size: 0.9rem;
  }

  .dialog-vs-type span.selected {
    border: 1px solid #f12b2b;
    color: #f12b2b
  }

  /*.dialog-vs-type.win span:nth-last-child(-n+3),*/
  /*.dialog-vs-type.lose span:nth-last-child(-n+3) {*/
    /*margin-bottom: 0;*/
  /*}*/

  /*.dialog-vs-type.draw span {*/
    /*margin-bottom: 0;*/
  /*}*/

  .dialog-vs-type span em {
    display: block;
  }

  .dialog-vs .com {
    margin-left: 3%;
    display: block;
    line-height: 30px;
    margin-bottom: 5px;
  }
  .dialog-vs .com em{
    font-weight: bold;
    font-style: italic;
  }
  .dialog-vs .dialog-main-btn {
    margin: 0;
    width: 50%;
    float: left;
    border-radius: 0;
  }

  .dialog-vs .dialog-main-btn.btn-cancel {
    background: none;
    border-top: 1px solid #aaa;
    color: #999;
  }

  .dialog-vs .dialog-main-btn.btn-confirm {
    background: #d64444;
    border-top: 1px solid #d64444;
    color: #fff;
  }

  .dialog-paper .vs {
    margin: 13px auto 0;
    position: relative;
    overflow: auto;
    zoom: 1;
  }

  .dialog-paper .vs em {
    text-align: center;
    width: 52px;
    line-height: 22px;
    font-size: 1.4rem;
    position: absolute;
    top: 1px;
    left: 50%;
    margin-left: -26px;
    border-radius: 13px;
  }

  .dialog-paper .vs .A {
    color: #f12b2b;
    border: 1px solid #f12b2b;
  }

  .dialog-paper .vs .B {
    color: #49c867;
    border: 1px solid #49c867;
  }

  .dialog-paper .vs .C {
    color: #1d9ff9;
    border: 1px solid #1d9ff9;
  }

  .dialog-paper .vs span {
    width: 38%;
    line-height: 26px;
    font-size: 15px;
    color: #333;
  }

  .dialog-paper .vs .win .selected {
    color: #f12b2b;
    border: 1px solid #f12b2b;
  }

  .dialog-paper .vs .draw .selected {
    color: #49c867;
    border: 1px solid #49c867;
  }

  .dialog-paper .vs .lose .selected {
    color: #1d9ff9;
    border: 1px solid #1d9ff9;
  }

  .dialog-paper .vs .fl {
    float: left;
    text-align: right;
  }

  .dialog-paper .vs .fr {
    float: right;
    text-align: left;
  }

  .dialog-alert h2 {
    margin: 0;
  }

  .dialog-main-btn {
    background: #f12b2b;
  }

  .share .dialog-main {
    background: url("../assets/bg-share-china.png");
    background-size: 100% auto;
    height: 0;
    padding: 39% 0;
  }

  .share .dialog-main-btn {
    position: absolute;
    bottom: 6%;
    font-size: 18px;
    color: #d4241f;
    background: #fff;
    width: 60%;
    min-width: 160px;
    left: 0;
    right: 0;
  }

  .share .dialog-main-close {
    background: url(../assets/i-close-dialog-share.png) center center no-repeat;
    background-size: 18px 18px;
  }
  section .show-0{
    max-height: 40px;
    overflow: hidden;
  }
  section .show-1{
    overflow: auto;
    max-height: none;
  }
  section .icon-0, section .icon-1 {
    font-size: 12px;
    text-align: center;
    color: #909090;
    height: 14px;
    line-height: 14px;
    padding: 15px 0;
  }
  section  span.icon_trigle {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    background: url(../assets/ico_tri.png) 0 0 no-repeat;
    background-size: 100% 100%;
  }
  section .icon-0 span.icon_trigle{
    transform: rotate(0);
  }
  section .icon-1 span.icon_trigle{
    transform: rotate(180deg);
  }
  section .icon-0:after{
    content:" 展开全部";
  }
  section .icon-1:after{
    content:" 向上收起";
  }
  section .title{
    color:#333;
    font-size: 15px;
    line-height: 24px;
    border-bottom: 1px solid #e6e3d4;
    padding:12px 16px 10px;
  }
  .em-ad {
    display: inline-block;
    color: #deb929;
    text-align: center;
    font-size: 10px;
    border: 1px solid #deb929;
    line-height: 15px;
    height: 15px;
    padding: 0 4px;
    margin-left: 4px;
    font-weight: 400;
    float: right;
    margin-top:3px;
  }
  .ad-list{
    padding:0;
    overflow: auto;
  }
  .ad-list li{
    padding:4% 0;
    margin:0 4%;
    height: 67px;
    border-bottom: 1px solid #e6e3d4;
  }
  .ad-list li img{
    float: left;
    width: 27%;
    height: 67px;
  }
  .ad-list li a{
    display: block;
    height: 100%;
  }
  .ad-list li p{
    height: 67px;
    overflow: hidden;
    line-height: 22px;
    margin-left: 10px;
    color: #2d2f32;
    font-size: 16px;
    float: left;
    width: 66%;
  }
  .main{
    margin-top: 0;
  }
  .dialog-main h2.dialog-main-title{
    text-align: center;
  }
  .dialog-tip .dialog-main{
    width: 75%;
  }
  .dialog-main{
    width: 75%;
  }
  /*下载天虹理财样式*/
  .ad-link{
    display: block;
    margin-top: -5px;
    color: #24af41;
    font-weight: 800;
    font-size: 15px;
    text-align: center;
  }
  .ad-link>.em-ad{
    float: none;
    margin-top: 0;
    vertical-align: middle;
  }
</style>
