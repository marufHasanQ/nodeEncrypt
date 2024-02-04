
import {randomBytes, scryptSync, encrypt, decrypt} from '../cryptoUtil/cryptoUtil'
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
                throw 'Encrypted';

            return checkEncrypted(data)[0];
        })
        // encrypt the data 
        .then(data => encrypt(data, password))
        .then(data => logger('encrypted object', data))
        // first puts the marker ENCRYPTED_TAG,
        // then hex string converted from buffer iv 
        // lastly the encrypted string back to file
        .then(data => writeFileContent(filePath, constructEncryptedData(data, ENCRYPTED_TAG, DATA_IV_DELIMITER)))
        .catch(e => console.error('File is already Encrypted'));

}

function decryptFile(filePath: string, password: string) {
    // get the content of the file
    getFileContent(filePath)
        //check if the file is already decrypted or not 
        .then(data => {
            let isEncrypted = checkEncrypted(data).length == 2;
            if (isEncrypted)
                return checkEncrypted(data)[1];

            throw 'Decrypted';
        })
        .then(data => parseEncryptedData(data, DATA_IV_DELIMITER))
        .then(data => decrypt(data.encryptedString, password, data.iv))
        .then(data => logger('decrypted content', data))

        .then(data => writeFileContent(filePath, data))
        .catch(e => console.error(e, 'File is already decrypted'));


}

function constructEncryptedData(encryptedDataObj: {encryptedString: string, iv: Buffer},
    ENCRYPTED_TAG: string,
    DATA_IV_DELIMITER: string): string {

    return ENCRYPTED_TAG + encryptedDataObj.iv.toString('hex') + DATA_IV_DELIMITER + encryptedDataObj.encryptedString;

}

function parseEncryptedData(data: string,
    DATA_IV_DELIMITER: string): {encryptedString: string, iv: Buffer} {
    return {
        encryptedString: data.split(DATA_IV_DELIMITER)[1],
        iv: Buffer.from(data.split(DATA_IV_DELIMITER)[0], 'hex')
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
