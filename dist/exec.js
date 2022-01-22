"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdir = exports.pull = exports.exec = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
function exec(command) {
    return new Promise((resolve, reject) => {
        try {
            const result = (0, child_process_1.execSync)(command).toString();
            resolve(result);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.exec = exec;
function pull(repoName = '', version = 'latest') {
    const pullUrl = `https://github.com/${repoName}`;
    try {
        return (0, child_process_1.execSync)(`git clone ${pullUrl}`).toString();
    }
    catch (e) {
        console.log(e);
    }
}
exports.pull = pull;
function mkdir(name) {
    return new Promise((resolve, reject) => {
        (0, fs_1.mkdir)(name, null, (err) => {
            if (err) {
                console.error(err);
                return resolve(false);
            }
            console.log(`created dir: ${name}`);
            resolve(true);
        });
    });
}
exports.mkdir = mkdir;
