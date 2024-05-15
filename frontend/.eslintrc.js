module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': ['error', 'single'],
    'no-var': 'error',
    'vue/multi-word-component-names': 0,
    'vue/no-mutating-props': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  overrides: [
    {
      'files': [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      'env': {
        'jest': true
      }
    }
  ]
};