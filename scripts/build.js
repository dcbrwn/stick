/**
 * Build process is so weird only because of this issue:
 * https://github.com/microsoft/TypeScript/issues/33079
 *
 * When it's solved, simple npm scripts can be safely used
 **/

const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

const relative = (part) => path.join(__dirname, part)

{
  const dist = relative('../dist')
  const pack = relative('../package.json')

  const buildResult = shell.exec('tsc')

  if (buildResult.code !== 0) {
    process.exit(buildResult.code)
  }

  shell.cp('./README.md', './dist/')

  const parsedPack = JSON.parse(fs.readFileSync(pack, { encoding: 'utf-8' }))

  parsedPack.type = 'module'
  parsedPack.files = fs.readdirSync(dist)
  delete parsedPack.devDependencies
  delete parsedPack.scripts
  delete parsedPack.source

  fs.writeFileSync(relative('../dist/package.json'), JSON.stringify(parsedPack, null, 2))
}
