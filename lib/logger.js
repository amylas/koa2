const log4js = require('koa-log4');
const path = require('path');
const config = require('../config/index.js')

let env = process.env.NODE_ENV;
let dir = env === 'prod' ? '/data/apps/node/log' : path.resolve(__dirname, '..');

//配置
let log4config = {
    'type': 'clustered', //支持cluster
    'appenders': [
            {
                'category': 'console',
                'type': 'console'
            },
            {
                'category': 'app',
                'type': 'file',
                'filename': dir+'/app.log',
                'maxLogSize': 104800,
                'backups': 100
            },
            {
                'category': 'access',
                'type': 'dateFile',
                'filename': dir+'/access',
                'alwaysIncludePattern': true,
                'pattern': '.yyyyMMdd.log'

            },
            {
                'category': 'error',
                'type': 'dateFile',
                'filename': dir+'/error',
                'alwaysIncludePattern': true,
                'pattern': '.yyyyMMdd.log'

            }
        ],
    'replaceConsole': true,
    'levels': {
        'console': 'ALL',
        'app': 'ALL',
        'access': 'ALL',
        'error': 'ALL'
    }
};

log4js.configure(log4config);

const logger = {
  access: log4js.koaLogger(log4js.getLogger('access'), { level: 'auto' }),
  error: log4js.getLogger('error'),
  app: log4js.getLogger('app')
}

module.exports = logger;
