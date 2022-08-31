import { execSync } from 'child_process'
import * as path from 'path'
const fs = require('fs-extra')
const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  unlinkSync,
  moveSync
} = require('fs-extra')

export function exec(command: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    try {
      const result = execSync(command).toString()

      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function pull(repoName = '', version = 'latest'): string | undefined {
  const pullUrl = `https://github.com/${repoName}`

  try {
    return execSync(`git clone ${pullUrl}`).toString()
  } catch (e) {
    console.log(e)
  }
}

export function mkdir(name: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.mkdir(name, null, (err: any) => {
      if (err) {
        console.error(err)

        return resolve(false)
      }

      console.log(`created dir: ${name}`)
      resolve(true)
    })
  })
}

export function resolveGitIgnore(appPath: string) {
  const gitignoreExists = existsSync(path.join(appPath, '.gitignore'))
  if (gitignoreExists) {
    // Append if there's already a `.gitignore` file there
    const data = readFileSync(path.join(appPath, 'gitignore'))
    appendFileSync(path.join(appPath, '.gitignore'), data)
    unlinkSync(path.join(appPath, 'gitignore'))
  } else {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    )
  }
}
