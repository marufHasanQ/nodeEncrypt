import {randomBytes, scryptSync, createDecipheriv, createCipheriv} from 'crypto'

const IV_BYTE_SIZE = 16;
const KEY_SIZE = 32;
const ALGO = 'aes-256-gcm';
const iv = randomBytes(IV_BYTE_SIZE);

function decrypt(encryptedContent: string, password: string, iv: Buffer | string, authTag: Buffer): Promise<string> {
    const key = scryptSync(password, 'salt', KEY_SIZE); //create key
    //console.log(encryptedContent, key, iv);
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
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
    const cipher = createCipheriv(ALGO, key, iv);
    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);

    cipher.write(fileContent);
    cipher.end();

    return new Promise((resolve, reject) => {
        cipher.on('end', () => resolve({encryptedString: encrypted, iv: iv, authTag: cipher.getAuthTag()}));
    })
}

export {randomBytes, scryptSync, encrypt, decrypt}

