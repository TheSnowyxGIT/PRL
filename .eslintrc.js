module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'consistent-return': 'off',
    'global-require': 'off',
    camelcase: 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
  },
};
