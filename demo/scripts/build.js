const esbuild = require('esbuild');
const shell = require('shelljs');

shell.cp('./src/index.html', './dist/')

esbuild.build({
  ...require('./commonConfig'),
  treeShaking: true,
  minify: true,
});
