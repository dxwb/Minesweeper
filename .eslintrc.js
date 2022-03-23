module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'no-new': 'off',
    'space-before-blocks': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never'
      }
    ],
    'keyword-spacing': 'off',
    'no-floating-decimal': 'off',
    'object-curly-spacing': ['error', 'never'],
    'no-debugger': 'off'
  }
}
