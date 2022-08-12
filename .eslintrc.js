/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser', // 指定为 vue-eslint-parser ，要兼容原 parser 放入 parserOptions的 parser
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
    project: './tsconfig.json',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**vite**',
          '**@vitejs**',
        ],
        optionalDependencies: false,
      },
    ],
    'max-len': ['error', { code: 200 }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
  },
  settings: {
    'import/extensions': ['.js', '.jsx', 'ts', 'tsx', 'vue'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', 'vue'], // 配置文件扩展名
      },
      // 配置alias
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', 'vue'],
      },
    },
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        /**
         * @description 修复 .vue 文件无法读取 global 的问题
         * @link https://github.com/typescript-eslint/typescript-eslint/releases/tag/v3.0.0
         * 最新的 @vue/eslint-config-typescript 中
         * 写法依旧是 'plugin:@typescript-eslint/eslint-recommended'
         */
        'no-undef': 'off',
      },
    },
  ],
};

module.exports = eslintConfig;
