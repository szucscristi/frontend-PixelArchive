// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    resolve: {
      alias: {
        // înlocuiește runtime-only cu build-ul complet care include message compiler
        'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js'
      }
    }
  }
})
