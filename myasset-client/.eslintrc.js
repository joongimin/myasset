module.exports = {
  root: true,
  env: { node: true },
  extends: ['plugin:vue/recommended', '@vue/prettier', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
