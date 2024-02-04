"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util/util");
if (process.argv.length < 3) {
    console.error('Us');
}
var CLI_OPTION = process.argv[2];
var FILE_NAME_ARGUMENT = process.argv[3];
var password = prompt('password: ')
    .then(function (password) { return nodeEncrypt(password); });
function nodeEncrypt(password) {
    if (CLI_OPTION == '-en') {
        (0, util_1.encryptFile)(FILE_NAME_ARGUMENT, password);
    }
    else if (CLI_OPTION == '-de') {
        (0, util_1.decryptFile)(FILE_NAME_ARGUMENT, password);
    }
}
function prompt(question) {
    var data = '';
    return new Promise(function (resolve, reject) {
        process.stdin.resume();
        process.stdout.write(question);
        //process.stdin.on('keypress', e => console.log('keyp'));
        //process.stdin.on('data', chunk => data = data + chunk);
        process.stdin.on('data', function (data) { process.stdin.pause(); resolve(data.toString().trim()); });
        process.stdin.on('error', function (err) { return reject(err); });
    });
}
/*
function hexToBuffer(hexString: string): ArrayBuffer {
    // return new Uint8Array('AA5504B10000B5'.match(/../g).map(h => parseInt(h, IV_BYTE_SIZE))).buffer;
}
*/
