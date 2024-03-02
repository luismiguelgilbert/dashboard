// module.exports = {
//   root: true,
//   extends: [
//     '@nuxt/eslint-config'
//   ],
//   rules: {
//     // Global
//     semi: ['error', 'never'],
//     quotes: ['error', 'single'],
//     'quote-props': ['error', 'as-needed'],
//     // Vue
//     'vue/multi-word-component-names': 0,
//     'vue/max-attributes-per-line': [
//       'warn',
//       {
//         singleline: {
//           max: 5
//         }
//       }
//     ],
//     'vue/no-v-html': 0
//   }
// }
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint:recommended',
    /* Eslint plugin vue things to note https://eslint.vuejs.org/user-guide/#faq */
    'plugin:vue/vue3-strongly-recommended',
    /* List of typescript specific linter rules for reference: https://typescript-eslint.io/rules/ */
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  globals: {
    cy: true
  },
  // List of vue linter rules for reference or updates: https://eslint.vuejs.org/rules/
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 2,
    'quotes': ['error', 'single'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'warn',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        multiline: 'never',
        singleline: 'never',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 1,
        multiline: 1,
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        alignAttributesVertically: true,
        ignores: []
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          normal: 'always',
          void: 'always',
        },
      }
    ],
    'vue/attributes-order': [
      'error',
      {
        'order': [
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'LIST_RENDERING',
          'DEFINITION',
          'TWO_WAY_BINDING',
          'GLOBAL',
          'OTHER_ATTR',
          'UNIQUE',
          'CONTENT',
          'OTHER_DIRECTIVES',
          'EVENTS',
        ],
        alphabetical: false,
      },
    ],
    'vue/attribute-hyphenation': [ 'error', 'never', { 'ignore': [] }],
  },
  overrides: [
    {
      files: ['**/cypress/**/*.spec.js', '**/tests/setupGlobals.js',],
      rules: {'no-undef': 'off'}
    }
  ]
};
