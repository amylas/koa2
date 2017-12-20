const request_config = require('../bin/config');
const config = {
  'test1-n.dongdong.com': '//test1-api.dongdong.com',
  'beta-n.dongdong.com': '//beta-api.dongdong.com',
  'n.dongdong.com': '//api.dongdong.com',
  'localhost': '/api'
};
//全局配置输出变量Authorization & UUID & apiDomain & staticDomain
module.exports = async(ctx, next) => {

  //输出配置Authorization & UUID,其中andriod获取authorization & uuid
  ctx.state.Authorization = ctx.header.Authorization || ctx.header.authorization || "";
  ctx.state.UUID = ctx.header.UUID || ctx.header.uuid || "";

  //输出配置apiDomain & staticDomain
  ctx.state.apiDomain = config[ctx.hostname];
  ctx.state.staticDomain = request_config.staticDomain;

  await next();
};
