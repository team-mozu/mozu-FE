module.exports = {
  plugins: ['no-relative-import-paths'],
  extends: ['@rushstack/eslint-config/profile/web-app'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-use-before-define': 'off',
    '@rushstack/typedef-var': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { variables: false, functions: false, classes: false },
    ],
  },
  settings: {},
};
