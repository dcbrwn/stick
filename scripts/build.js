import shell from 'shelljs'

{
  const buildResult = shell.exec('tsc')

  if (buildResult.code !== 0) {
    process.exit(buildResult.code)
  }

  shell.cp('./package.json', './dist/')
  shell.cp('./README.md', './dist/')
}
