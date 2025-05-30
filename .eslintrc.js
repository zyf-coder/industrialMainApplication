module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    // 额外添加的规则可查看 https://vuejs.github.io/eslint-plugin-vue/rules/
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    // 指定解析器 parser
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 12,
    allowImportExportEverywhere: true, // 不限制eslint对import使用位置
  },
  settings: {
    'import/resolver': {
      webpack: {
        // 此处config对应webpack.config.js的路径，我这个路径是vue-cli3默认的路径
        config: 'node_modules/@vue/cli-service/webpack.config.js'
      }
    }
  },
  // 取消没必要的校验
  rules: {
    // 解决import/no-unresolved
    'import/extensions': [2, 'never', { js: 'never', json: 'never' }],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/no-unresolved': [2, { ignore: ['antd-mobile'] }],
    // 关闭无关紧要的eslint
    'import/no-named-as-default': 0,
    'semi': 0,
    'no-bitwise': 0, // 不让使用位运算
    'prefer-regex-literals': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'array-callback-return': 0,
    'dot-notation': 0,
    'default-param-last': 0,
    'no-else-return': 0,
    'no-case-declarations': 0,
    'import/prefer-default-export': 0,
    'import/newline-after-import': 0,
    'import/no-cycle': 0,
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': 0,
    'vue/attributes-order': 0,
    'vue/html-self-closing': 0,
    'max-len': 0,
    'max-classes-per-file': 0,
    'comma-dangle': 0,
    'no-param-reassign': 0,
    'prefer-template': 0, // 使用es6拼接字符串
    'func-names': 0, // 无名函数
    'consistent-return': 0, // 有函数返回值
    'no-underscore-dangle': 0, // 不允许有下划线
    'no-use-before-define': 0, // 变量提升识别错误
    'no-unused-expressions': 0, // 使用函数代替表达式
    'no-restricted-syntax': 0, // 禁止使用特定的语法比如for in
    'no-plusplus': 0, // 不能用++
    'no-eval': 0, // 不能用eval
    'arrow-body-style': 0, // 箭头函数块周围禁止使用{}
    'guard-for-in': 0, // in里面不能有if
    radix: 0, // 省略参数
    'no-unsafe-optional-chaining': 0,
    'vue/no-v-text-v-html-on-component': 0,
    'linebreak-style': [0, 'error', 'window'], // 换行风格
    'no-continue': 0,
    'no-await-in-loop': 0,
    "global-require": 0,
  },
};
