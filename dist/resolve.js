"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNpmAndExtract = exports.emptyDir = exports.isEmpty = exports.copyDir = exports.toValidPackageName = exports.isValidPackageName = exports.copy = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-check
const extract = require('fast-extract');
const exec_1 = require("./exec");
const fs = require("fs");
const path = require("path");
function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    }
    else {
        fs.copyFileSync(src, dest);
    }
}
exports.copy = copy;
function isValidPackageName(projectName) {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
}
exports.isValidPackageName = isValidPackageName;
function toValidPackageName(projectName) {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z0-9-~]+/g, '-');
}
exports.toValidPackageName = toValidPackageName;
function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}
exports.copyDir = copyDir;
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}
exports.isEmpty = isEmpty;
function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const file of fs.readdirSync(dir)) {
        const abs = path.resolve(dir, file);
        // baseline is Node 12 so can't use rmSync :(
        if (fs.lstatSync(abs).isDirectory()) {
            emptyDir(abs);
            fs.rmdirSync(abs);
        }
        else {
            fs.unlinkSync(abs);
        }
    }
}
exports.emptyDir = emptyDir;
async function fetchNpmAndExtract(pkg, targetDir = '.') {
    console.group(pkg);
    console.log('Start fetch npm package: ' + pkg);
    // download package from npm
    await (0, exec_1.exec)(`npm pack ${pkg}`);
    const latestVersion = await (0, exec_1.exec)(`npm view ${pkg} version`);
    // use tar to unpack all
    const pkgName = `${pkg.replace('/', '-')}-${latestVersion}.tgz`.replace(/\s|@/g, '');
    console.log('Package Name downloaded, start to extract: ', pkgName);
    // extract package
    await extract(pkgName, targetDir, { strip: 1 });
    // delete package
    await (0, exec_1.exec)(`rm -f ${pkgName}`);
    console.log('Package resolved! ' + pkg);
    console.groupEnd();
}
exports.fetchNpmAndExtract = fetchNpmAndExtract;
