const http = require('http');
const handler = require('serve-handler');
const esbuild = require('esbuild');
const shell = require('shelljs');

const config = require('./commonConfig')

const server = http.createServer((request, response) => {
  // https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: config.outdir
  });
})

const port = 1234

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);

  shell.cp('./src/index.html', './dist/')

  esbuild.build({
    ...config,
    watch: true,
    sourcemap: 'inline',
  });
});
