var request_config = {
  //纯粹的内网域名:appDomain
  appDomain: 'test1-api.dongdong.com',
  //静态资源请求域名:staticDomain
  staticDomain: '',
  //安卓app内请求域名:androidDomain
  androidDomain: 'mmp'
};

module.exports = {
  appDomain: 'https://'+request_config.appDomain,
  staticDomain: request_config.staticDomain,
  androidDomain: 'https://'+ request_config.androidDomain
};
