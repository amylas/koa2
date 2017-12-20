const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
//const logger = require('koa-logger');
const path = require('path');
const serve = require('koa-static2');

const webapp = require('./routes/webapp');
const api = require('./routes/api');
const commonMiddle = require('./middlewares/commonMiddle');

const logger = require('./lib/logger.js');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger.access));

// 三个静态目录
app.use(serve("public", './public'));
app.use(serve("static", './webapp/static'));
// 模版引擎
app.use(views(path.resolve(__dirname, './views'), {
  map: {
    html: 'handlebars',
  },
  extension: 'html',
}));

// router
router.use('/webapp', commonMiddle, webapp.routes(), webapp.allowedMethods());
router.use('/v1', commonMiddle, api.routes(), api.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// error
app.on('error', function(err, ctx){
  let log = logger.error;
  console.log(err);
  log.error('server error', err, ctx);
});

module.exports = app;
