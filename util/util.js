"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptFile = exports.encryptFile = void 0;
var cryptoUtil_1 = require("../cryptoUtil/cryptoUtil");
var fileUtil_1 = require("../fileUtil/fileUtil");
var DATA_IV_DELIMITER = '|||';
var ENCRYPTED_TAG = 'ENCRYPTED$$$';
function encryptFile(filePath, password) {
    //get content of  the file
    (0, fileUtil_1.getFileContent)(filePath)
        //check if the file is already encrypted or not 
        .then(function (data) {
        var isEncrypted = checkEncrypted(data).length == 2;
        if (isEncrypted)
            throw 'Encrypted';
        return checkEncrypted(data)[0];
    })
        // encrypt the data 
        .then(function (data) { return (0, cryptoUtil_1.encrypt)(data, password); })
        .then(function (data) { return logger('encrypted object', data); })
        // first puts the marker ENCRYPTED_TAG,
        // then hex string converted from buffer iv 
        // lastly the encrypted string back to file
        .then(function (data) { return (0, fileUtil_1.writeFileContent)(filePath, ENCRYPTED_TAG + data.iv.toString('hex') + DATA_IV_DELIMITER + data.encryptedString); })
        .catch(function (e) { return console.error('File is already Encrypted'); });
}
exports.encryptFile = encryptFile;
function decryptFile(filePath, password) {
    // get the content of the file
    (0, fileUtil_1.getFileContent)(filePath)
        //check if the file is already decrypted or not 
        .then(function (data) {
        var isEncrypted = checkEncrypted(data).length == 2;
        if (isEncrypted)
            return checkEncrypted(data)[1];
        throw 'Decrypted';
    })
        //first IV_BYTE_SIZE bytes of the data should be iv
        // because in hex string, each byte take up two characters, position where actual
        // file data starts should be IV_BYTE_SIZE * 2
        //
        //
        .then(function (data) { return (0, cryptoUtil_1.decrypt)(data.split(DATA_IV_DELIMITER)[1], password, Buffer.from(data.split(DATA_IV_DELIMITER)[0], 'hex')); })
        .then(function (data) { return logger('decrypted content', data); })
        .then(function (data) { return (0, fileUtil_1.writeFileContent)(filePath, data); })
        .catch(function (e) { return console.error(e, 'File is already decrypted'); });
}
exports.decryptFile = decryptFile;
function logger(description, params) {
    console.log(description, params);
    return params;
}
function checkEncrypted(data) {
    return data.split(ENCRYPTED_TAG);
}
