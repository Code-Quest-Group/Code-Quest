import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      'semi': ['error', 'never'],
      'react/react-in-jsx-scope': 'off',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'space-in-parens': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-multi-spaces': 'error',
      'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': true }],
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
      'indent': ['error', 2],
      'max-len': ['warn', { 'code': 120, 'ignoreUrls': true }],
    },
  },
]
