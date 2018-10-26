const path = require('path');
var prod = process.env.NODE_ENV === 'production';
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

module.exports = {
  wpyExt: '.wpy',
  eslint: false,
  cliLogs: !prod,
  build: {
    web: {
      htmlTemplate: path.join('src', 'index.template.html'),
      htmlOutput: path.join('web', 'index.html'),
      jsOutput: path.join('web', 'index.js')
    }
  },
  compilers: {
    less: {
      compress: prod,
      plugins: [new LessPluginAutoPrefix({
        browsers: ['Android >= 2.3', 'Chrome > 20', 'iOS >= 6']
      })]
    },
    /*sass: {
      outputStyle: 'compressed'
    },*/
    typescript: {},
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions',
        "syntax-export-extensions"
      ]
    }
  },
  plugins: {},
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (prod) {

  // 压缩sass
  // module.exports.compilers['sass'] = {outputStyle: 'compressed'}

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {}
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
module.exports.plugins = module.exports.plugins || {};

module.exports.plugins.replace = [{
    filter: /rxjs[\\/]util[\\/].*\.js$/,
    config: {
      find: /require\(['"]\.\/root.js['"]\)/,
      replace: '{root:require(\'./../../wepy-async-function/global.js\')}'
    }
  },
  {
    filter: /rxjs[\\/](scheduler|symbol|observable)[\\/].*\.js$/,
    config: {
      find: /require\(['"]\.\/\.\.\/util\/root\.js['"]\)/,
      replace: '{root:require(\'./../../wepy-async-function/global.js\')}'
    }
  },
  {
    filter: /rxjs[\\/]observable\/dom[\\/].*\.js$/,
    config: {
      find: /require\(['"]\.\/\.\.\/\.\.\/util\/root\.js['"]\)/,
      replace: '{root:require(\'./../../../wepy-async-function/global.js\')}'
    }
  },
  {
    filter: /rxjs[\\/]Observable.js$/,
    config: {
      find: /require\(['"]\.\/util\/root.js['"]\)/,
      replace: '{root:require(\'./../wepy-async-function/global.js\')}'
    }
  },
]
