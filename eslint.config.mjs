// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

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
  }
})
