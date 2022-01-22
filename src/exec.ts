import { execSync } from 'child_process'
import { mkdir as md } from 'fs'
import * as path from 'path'

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
    md(name, null, (err) => {
      if (err) {
        console.error(err)

        return resolve(false)
      }

      console.log(`created dir: ${name}`)
      resolve(true)
    })
  })
}
