import {randomBytes, scryptSync, createDecipheriv, createCipheriv} from 'crypto'

const IV_BYTE_SIZE = 16;
const KEY_SIZE = 24;
const iv = randomBytes(IV_BYTE_SIZE);

function decrypt(encryptedContent: string, password: string, iv: Buffer | string): Promise<string> {
    const key = scryptSync(password, 'salt', KEY_SIZE); //create key
    //console.log(encryptedContent, key, iv);
    const decipher = createDecipheriv('aes-192-cbc', key, iv);
    let decrypted = '';
    decipher.on('data', (chunk) => decrypted += chunk);

    decipher.write(encryptedContent, 'hex');
    decipher.end();

    return new Promise((resolve, reject) => {
        decipher.on('end', () => resolve(decrypted));
    })
}

function encrypt(fileContent: string, password: string): Promise<object> {
    const key = scryptSync(password, 'salt', KEY_SIZE); //create key
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);

    cipher.write(fileContent);
    cipher.end();

    return new Promise((resolve, reject) => {
        cipher.on('end', () => resolve({encryptedString: encrypted, iv: iv}));
    })
}

export {randomBytes, scryptSync, encrypt, decrypt}

