import {encrypt, decrypt} from '../cryptoUtil/cryptoUtil'
import {getFileContent, writeFileContent} from '../fileUtil/fileUtil'


const DATA_IV_DELIMITER = '|||';
const ENCRYPTED_TAG = 'ENCRYPTED$$$';

function encryptFile(filePath: string, password: string) {

    //get content of  the file
    getFileContent(filePath)
        //check if the file is already encrypted or not
        .then(data => {
            let isEncrypted = checkEncrypted(data).length == 2;
            if (isEncrypted)
                throw 'File is already Encrypted';

            return checkEncrypted(data)[0];
        })
        // encrypt the data
        .then(data => encrypt(data, password))
        .then(data => logger('encrypted object', data))
        .then(data => writeFileContent(filePath, constructEncryptedData(data, ENCRYPTED_TAG, DATA_IV_DELIMITER)))
        .catch(e => console.error(e));

}

function decryptFile(filePath: string, password: string) {
    // get the content of the file
    getFileContent(filePath)
        //check if the file is already decrypted or not
        .then(data => {
            let isEncrypted = checkEncrypted(data).length == 2;
            //if the file is not decrypted then return content of the file without ENCRYPTED_TAG portion.
            //otherwise throw error
            if (isEncrypted)
                return checkEncrypted(data)[1];

            throw 'Decrypted';
        })

        .then(data => parseEncryptedData(data, DATA_IV_DELIMITER))
        .then(data => decrypt(password, data.encryptedString, data.iv, data.authTag))
        .then(data => logger('decrypted content', data))

        .then(data => writeFileContent(filePath, data))
        .catch(e => console.error(e, 'File is already decrypted'));


}

function constructEncryptedData(encryptedDataObj: {encryptedString: string, iv: Buffer, authTag: Buffer},
    ENCRYPTED_TAG: string,
    DATA_IV_DELIMITER: string): string {

    // first puts the marker ENCRYPTED_TAG, tells the program if the file is already encrypted or not
    // then hex string converted from buffer iv
    // then  the encrypted string
    // lastly the authentication tag
    //
    return ENCRYPTED_TAG + encryptedDataObj.iv.toString('hex') + DATA_IV_DELIMITER + encryptedDataObj.encryptedString + DATA_IV_DELIMITER + encryptedDataObj.authTag.toString('hex');

}

function parseEncryptedData(data: string,
    DATA_IV_DELIMITER: string): {encryptedString: string, iv: Buffer, authTag: Buffer} {
    return {
        encryptedString: data.split(DATA_IV_DELIMITER)[1],
        iv: Buffer.from(data.split(DATA_IV_DELIMITER)[0], 'hex'),
        authTag: Buffer.from(data.split(DATA_IV_DELIMITER)[2], 'hex')
    }
}
function logger(description: string, params: any) {
    console.log(description, params);
    return params;
}


function checkEncrypted(data: string): string[] {
    return data.split(ENCRYPTED_TAG);
}
export {encryptFile, decryptFile}
