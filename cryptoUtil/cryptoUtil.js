"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.scryptSync = exports.randomBytes = void 0;
var crypto_1 = require("crypto");
Object.defineProperty(exports, "randomBytes", { enumerable: true, get: function () { return crypto_1.randomBytes; } });
Object.defineProperty(exports, "scryptSync", { enumerable: true, get: function () { return crypto_1.scryptSync; } });
function decrypt(encryptedContent, key, iv) {
    console.log(iv);
    //console.log(encryptedContent, key, iv);
    var decipher = (0, crypto_1.createDecipheriv)('aes-192-cbc', key, iv);
    var decrypted = '';
    //decipher.setEncoding('hex');
    /*
    decipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = decipher.read())) {
            decrypted += chunk.toString('utf8');
        }
    });
*/
    decipher.on('data', function (chunk) { return decrypted += chunk; });
    decipher.write(encryptedContent, 'hex');
    decipher.end();
    return new Promise(function (resolve, reject) {
        decipher.on('end', function () { return resolve(decrypted); });
    });
}
exports.decrypt = decrypt;
function encrypt(fileContent, key, iv) {
    var cipher = (0, crypto_1.createCipheriv)('aes-192-cbc', key, iv);
    var encrypted = '';
    cipher.setEncoding('hex');
    cipher.on('data', function (chunk) { return encrypted += chunk; });
    cipher.write(fileContent);
    cipher.end();
    return new Promise(function (resolve, reject) {
        cipher.on('end', function () { return resolve(encrypted); });
    });
}
exports.encrypt = encrypt;
