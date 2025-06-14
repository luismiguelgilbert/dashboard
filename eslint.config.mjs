// @ts-check
import oxlint from 'eslint-plugin-oxlint';
import withNuxt from './.nuxt/eslint.config.mjs'
// eslint.config.mjs
// .oxlintrc.json

export default withNuxt({
  rules: {
    '@stylistic/comma-dangle': 'off',
    '@stylistic/member-delimiter-style': 'off',
    '@stylistic/semi': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/max-attributes-per-line': ['error', { singleline: 3 }],
    'vue/no-multiple-template-root': 'off',
  },
},
oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
)
