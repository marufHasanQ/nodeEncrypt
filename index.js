"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileUtil_1 = require("./fileUtil/fileUtil");
var cryptoUtil_1 = require("./cryptoUtil/cryptoUtil");
/*
console.log(fs.open);
console.log(process.argv[2]);
const key = randomBytes(24);
*/
var IV_BYTE_SIZE = 16;
var key = (0, cryptoUtil_1.scryptSync)(process.argv[4], 'salt', 24); //create key
var iv = (0, cryptoUtil_1.randomBytes)(IV_BYTE_SIZE);
if (process.argv.length < 2) {
    throw "file name required";
}
nodeEncrypt();
function nodeEncrypt() {
    if (process.argv[2] == '-en') {
        (0, fileUtil_1.getFileContent)(process.argv[3])
            .then(function (data) { return logger('fileContent', data); })
            .then(function (data) {
            var isEncrypted = checkEncrypted(data).length == 2;
            if (isEncrypted)
                throw 'Encrypted';
            return checkEncrypted(data)[0];
        })
            .then(function (data) { return (0, cryptoUtil_1.encrypt)(data, key, iv); })
            .then(function (data) { return logger('encrypted content', data); })
            .then(function (data) { return (0, fileUtil_1.writeFileContent)(process.argv[3], 'ENCRYPTED$$$' + iv.toString('hex') + data); })
            .catch(function (e) { return console.error('File is already Encrypted'); });
    }
    else if (process.argv[2] == '-de') {
        (0, fileUtil_1.getFileContent)(process.argv[3])
            //    .then(data => logger('buffer', Buffer.from(data.slice(0, IV_BYTE_SIZE * 2), 'hex')))
            //   .then(data => logger('bufferiv', iv))
            .then(function (data) {
            var isEncrypted = checkEncrypted(data).length == 2;
            if (isEncrypted)
                return checkEncrypted(data)[1];
            throw 'Decrypted';
        })
            .then(function (data) { return (0, cryptoUtil_1.decrypt)(data.slice(IV_BYTE_SIZE * 2), key, Buffer.from(data.slice(0, IV_BYTE_SIZE * 2), 'hex')); })
            .then(function (data) { return logger('decrypted content', data); })
            .then(function (data) { return (0, fileUtil_1.writeFileContent)(process.argv[3], data); })
            .catch(function (e) { return console.error('File is already decrypted'); });
    }
    function logger(description, params) {
        console.log(description, params);
        return params;
    }
}
function checkEncrypted(data) {
    return data.split('ENCRYPTED$$$');
}
/*
function hexToBuffer(hexString: string): ArrayBuffer {
    // return new Uint8Array('AA5504B10000B5'.match(/../g).map(h => parseInt(h, IV_BYTE_SIZE))).buffer;
}
*/
