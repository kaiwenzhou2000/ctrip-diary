module.exports = {
  parser: '@typescript-eslint/parser', // 定义ESLint的解析器
  extends: [
    'eslint:recommended', // ESLint的推荐规则
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/recommended的推荐规则
    'plugin:react/recommended', // eslint-plugin-react的推荐规则
    'plugin:react-hooks/recommended', // eslint-plugin-react-hooks的推荐规则
    'plugin:prettier/recommended', // 启用eslint-plugin-prettier和eslint-config-prettier
  ],
  plugins: [
    '@typescript-eslint', // 使用@typescript-eslint/eslint-plugin
    'react', // 使用eslint-plugin-react
    'react-hooks', // 使用eslint-plugin-react-hooks
  ],
  settings: {
    react: {
      version: 'detect', // 自动检测React的版本
    },
  },
  env: {
    browser: true, // 浏览器全局变量
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020, // 允许解析现代ECMAScript特性
    sourceType: 'module', // 允许使用模块
    ecmaFeatures: {
      jsx: true, // 允许对JSX的解析
    },
  },
  rules: {
    // 在此定义自己的规则或覆盖规则
    'import/no-anonymous-default-export': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // 只针对TypeScript和TSX文件
    },
    {
      files: ['apps/admin-panel/**'],
      extends: ['next/core-web-vitals'],
      rules: {
        // 在此定义自己的规则或覆盖规则
        'import/no-anonymous-default-export': 'off',
        'react/display-name': 'off',
      },
    },
  ],
}
