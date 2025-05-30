// eslint-disable-next-line
const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);
const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/' : '/';
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  lintOnSave: !isProduction,
  publicPath,
  css: {
    extract: {
      Type: true,
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      // src定义成@
      .set('@', resolve('src'))
      // components定义成_c
      .set('_c', resolve('src/components'));
    config.resolve.extensions
      .add('.js')
      .add('.json')
      .add('.jsx');
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');

    // 支持vue template 可选链和空值合并
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line
        options.compiler = require('vue-template-babel-compiler');
        return options;
      });
  },
  devServer: {
    host: 'localhost',
    port: '8081',
    https: false,
    hotOnly: false,
    proxy: {
      '/teis/': {
        target: 'http://192.168.210.57:32556/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/teis/': '/teis/'
        }
      },
      '/teis_8520/': {
        target: 'http://192.168.102.200:8520/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/teis_8520/': '/teis/'
        }
      },
      '/consumer_test/': {
        target: 'http://192.168.210.57:30522/',
        // target: 'http://10.8.1.142:33335/', // 张磊
        changeOrigin: true,
        ws: true,
        compress: false,
        pathRewrite: {
          '^/consumer_test/': '/consumer/'
        }
      },
      '/uaa/': {
        target: 'http://192.168.210.52:30606',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/uaa/': '/uaa/',
        }
      },
      '/amapdwr/': {
        target: 'http://192.168.210.55:22678/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/amapdwr/': '/amapdwr/',
        },
      },
      '/teis-policy/': {
        target: 'http://192.168.210.57:32002/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/teis-policy/': '/teis-policy/',
        }
      },
      '/teis-jzzs/': {
        target: 'http://192.168.210.57:31002/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/teis-jzzs/': '/teis-jzzs/',
        }
      },

      '/sx/dl/': {
        target: 'http://ai.trs.cn/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/sx/dl/': '/sx/dl/',
        }
      },
      '/sx2/dl/': {
        target: 'http://ai.trs.cn/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/sx2/dl/': '/sx2/dl/',
        }
      },
      '/uie/': {
        target: 'http://192.168.210.55:17001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/uie/': '/uie/',
        }
      },
      '/virtual/file': {
        target: 'http://192.168.210.71:8899'
      }
    }
  }
};
