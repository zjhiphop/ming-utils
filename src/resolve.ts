/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-check
const extract = require('fast-extract')
import { exec } from './exec'
import * as fs from 'fs'
import * as path from 'path'

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

export function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

export function isEmpty(path: string) {
  return fs.readdirSync(path).length === 0
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

export async function fetchNpmAndExtract(
  pkg: string,
  targetDir = '.'
): Promise<any> {
  console.group(pkg)

  console.log('Start fetch npm package: ' + pkg)

  // download package from npm
  await exec(`npm pack ${pkg}`)

  const latestVersion = await exec(`npm view ${pkg} version`)

  // use tar to unpack all
  const pkgName = `${pkg.replace('/', '-')}-${latestVersion}.tgz`.replace(
    /\s|@/g,
    ''
  )

  console.log('Package Name downloaded, start to extract: ', pkgName)

  // extract package
  await extract(pkgName, targetDir, { strip: 1 })

  // delete package
  await exec(`rm -f ${pkgName}`)

  console.log('Package resolved! ' + pkg)

  console.groupEnd()
}
