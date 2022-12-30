module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'semi': ['error', 'always'],
    'max-len': ["error", { "code": 180, "ignoreComments": true }],
    "vue/script-indent": ["error", 2, { "baseIndent": 1 }]
  },
};
