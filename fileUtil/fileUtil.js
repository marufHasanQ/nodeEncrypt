"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileContent = exports.getFileContent = void 0;
var fs = require("fs/promises");
function getFileContent(filePath) {
    var data = '';
    var fileHandle;
    return new Promise(function (resolve, reject) {
        return fs.open(filePath)
            .then(function (fd) {
            fileHandle = fd;
            return fd.createReadStream();
        })
            .then(function (fileReadStream) {
            fileReadStream.on('data', function (chunk) { return data = data + chunk; });
            fileReadStream.on('end', function () {
                fileHandle.close();
                resolve(data);
            });
        });
    });
}
exports.getFileContent = getFileContent;
function writeFileContent(filePath, content) {
    var fileHandle;
    return new Promise(function (resolve, reject) {
        return fs.open(filePath, 'w')
            .then(function (fd) {
            fileHandle = fd;
            return fd.createWriteStream();
        })
            .then(function (fileWriteStream) {
            fileWriteStream.write(content);
            fileWriteStream.end();
            fileHandle.close();
            resolve(content);
        });
    });
}
exports.writeFileContent = writeFileContent;
