import pluginVue from 'eslint-plugin-vue'

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            component: 'always',
            normal: 'always',
            void: 'always'
          }
        }
      ],
      'vue/attributes-order': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/order-in-components': 'off',
      'vue/singleline-html-element-content-newline': 'off'
    }
  }
]
