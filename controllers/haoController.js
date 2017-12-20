const router = require('koa-router')();
const request = require('koa2-request');
const apiDomain = require('../bin/config').appDomain;

router.get('/:id', async(ctx, next) => {

  let id = ctx.params.id || 0;
  let [article,writer] = await Promise.all([request({
    url: `${apiDomain}/v2/article/content/${id}`,
    method: 'get',
    headers: {},
    json: true,
    body: {}
  }),request({
    url: `${apiDomain}/v2/dqh/writer/${id}`,
    method: 'get',
    headers: {},
    json: true,
    body: {}
  })]);

  if(!article.body.id){//文章不存在
    ctx.state.error = "文章不存在";
    await ctx.render('error.html');
  }else{
    ctx.state.article = article.body;
    ctx.state.writer = writer.body;
    if(writer.body.user_id === '2776814'){
      ctx.state.dqd_ads = {
        'android_href': "https://m.dongdong.com/redirect?ref=zc_yytj&url=" + encodeURI("https://dqdfiles.b0.upaiyun.com/app/159jc/159jczq.apk"),
        'ios_href': "https://m.dongdong.com/redirect?ref=zc_yytj&url=" + encodeURI("https://itunes.apple.com/cn/app/159jing-cai-zu-qiu-jing-cai/id1121573293?mt=8&at=1l3v3QB")
      };
    }
    console.log(ctx.state.article);
    console.log(ctx.state.writer);
    await ctx.render('../webapp/hao.html');
  }

});

module.exports = router;
