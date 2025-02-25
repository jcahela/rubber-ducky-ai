const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  pages: {
    content: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  filenameHashing: false,
  css: {
    extract: true,
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
    },
    optimization: {
      splitChunks: false,
    },
  },
});
