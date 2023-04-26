module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    wx: 'readonly',
    uni: 'readonly',
    getCurrentPages: 'readonly'
  },
  rules: {
    'no-var': 'error',
    eqeqeq: 'error',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }]
  }
}
