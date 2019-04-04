module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true,
    node: true,
    mocha: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {}
};
