import {randomBytes, scryptSync, createDecipheriv, createCipheriv} from 'crypto'

function decrypt(encryptedContent: string, key: Buffer, iv: Buffer | string): Promise<string> {
    console.log(iv);
    //console.log(encryptedContent, key, iv);
    const decipher = createDecipheriv('aes-192-cbc', key, iv);
    let decrypted = '';
    //decipher.setEncoding('hex');
    /*
    decipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = decipher.read())) {
            decrypted += chunk.toString('utf8');
        }
    });
*/
    decipher.on('data', (chunk) => decrypted += chunk);

    decipher.write(encryptedContent, 'hex');
    decipher.end();

    return new Promise((resolve, reject) => {
        decipher.on('end', () => resolve(decrypted));
    })
}

function encrypt(fileContent: string, key: Buffer, iv: Buffer): Promise<string> {
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);

    cipher.write(fileContent);
    cipher.end();

    return new Promise((resolve, reject) => {
        cipher.on('end', () => resolve(encrypted));
    })
}
export {randomBytes, scryptSync, encrypt, decrypt}

