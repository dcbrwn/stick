import { URL } from 'url'
import fs from 'fs'
import shell from 'shelljs'

const relative = (path) => new URL(path, import.meta.url)

{
  const dist = relative('../dist')
  const pack = relative('../package.json')

  const buildResult = shell.exec('tsc')

  if (buildResult.code !== 0) {
    process.exit(buildResult.code)
  }

  shell.cp('./README.md', './dist/')

  const parsedPack = JSON.parse(fs.readFileSync(pack, { encoding: 'utf-8' }))

  parsedPack.files = fs.readdirSync(dist)
  delete parsedPack.devDependencies

  fs.writeFileSync(relative('../dist/package.json'), JSON.stringify(parsedPack, null, 2))
}
