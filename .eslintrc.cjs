module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/eslint-config-prettier'],
  rules: {
    'no-extra-boolean-cast': 'off',
  },
};
