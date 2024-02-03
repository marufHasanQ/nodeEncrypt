import {getFileContent, writeFileContent} from './fileUtil/fileUtil';

import {randomBytes, scryptSync, encrypt, decrypt} from './cryptoUtil/cryptoUtil'
/*
console.log(fs.open);
console.log(process.argv[2]);
const key = randomBytes(24);
*/
const IV_BYTE_SIZE = 16;
const key = scryptSync(process.argv[4], 'salt', 24); //create key

const iv = randomBytes(IV_BYTE_SIZE);

if (process.argv.length < 2) {
    throw "file name required";
}
nodeEncrypt();
function nodeEncrypt() {

    if (process.argv[2] == '-en') {
        getFileContent(process.argv[3])
            .then(data => logger('fileContent', data))
            .then(data => {
                let isEncrypted = checkEncrypted(data).length == 2;
                if (isEncrypted)
                    throw 'Encrypted';

                return checkEncrypted(data)[0];
            })

            .then(data => encrypt(data, key, iv))
            .then(data => logger('encrypted content', data))
            .then(data => writeFileContent(process.argv[3], 'ENCRYPTED$$$' + iv.toString('hex') + data))
            .catch(e => console.error('File is already Encrypted'));

    }
    else if (process.argv[2] == '-de') {
        getFileContent(process.argv[3])
            //    .then(data => logger('buffer', Buffer.from(data.slice(0, IV_BYTE_SIZE * 2), 'hex')))
            //   .then(data => logger('bufferiv', iv))


            .then(data => {
                let isEncrypted = checkEncrypted(data).length == 2;
                if (isEncrypted)
                    return checkEncrypted(data)[1];

                throw 'Decrypted';
            })
            .then(data => decrypt(data.slice(IV_BYTE_SIZE * 2), key, Buffer.from(data.slice(0, IV_BYTE_SIZE * 2), 'hex')))
            .then(data => logger('decrypted content', data))
            .then(data => writeFileContent(process.argv[3], data))
            .catch(e => console.error('File is already decrypted'));

    }

    function logger(description: string, params: any) {
        console.log(description, params);
        return params;
    }
}
function checkEncrypted(data: string): string[] {
    return data.split('ENCRYPTED$$$')
}
/*
function hexToBuffer(hexString: string): ArrayBuffer {
    // return new Uint8Array('AA5504B10000B5'.match(/../g).map(h => parseInt(h, IV_BYTE_SIZE))).buffer;
}
*/
