import shell from 'shelljs'

buildLibrary()

function buildLibrary () {
  const buildResult = shell.exec('tsc')

  if (buildResult.code !== 0) {
    process.exit(buildResult.code)
  }

  shell.cp('./package.json', './dist/')
  shell.cp('./README.md', './dist/')
}
