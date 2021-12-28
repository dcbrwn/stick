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
    // This one is broken for cases like `new Map<T, [Element, (() => () => void) | null]>()`
    // It complains about the space after `Element,`
    'func-call-spacing': 0,
    'func-style': [2, 'expression'],
    'no-redeclare': 0
  }
}
