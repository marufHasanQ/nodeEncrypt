"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util/util");
/*
console.log(fs.open);
console.log(process.argv[2]);
const key = randomBytes(24);
*/
if (process.argv.length < 2) {
    throw "file name required";
}
nodeEncrypt();
function nodeEncrypt() {
    if (process.argv[2] == '-en') {
        (0, util_1.encryptFile)(process.argv[3], process.argv[4]);
    }
    else if (process.argv[2] == '-de') {
        (0, util_1.decryptFile)(process.argv[3], process.argv[4]);
    }
}
/*
function hexToBuffer(hexString: string): ArrayBuffer {
    // return new Uint8Array('AA5504B10000B5'.match(/../g).map(h => parseInt(h, IV_BYTE_SIZE))).buffer;
}
*/
