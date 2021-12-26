module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  globals: {
    DocumentOrShadowRoot: false,
    HTMLElementTagNameMap: false,
    EventListenerOptions: false,
    VoidFunction: false
  },
  rules: {
    'no-redeclare': 0
  }
}
