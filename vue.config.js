const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pages: {
    content: {
      entry: 'src/content/main.js',
      filename: 'content.html'
    }
  },
  filenameHashing: false,
  css: {
    extract: true
  },
  configureWebpack: {
    output: {
      filename: '[name].js'
    },
    optimization: {
      splitChunks: false
    }
  }
})
