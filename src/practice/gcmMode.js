const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

const encrypt = (plainText, key, iv) => {
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag
    };
};

const decrypt = (encryptedText, key, iv, authTag) => {
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Generate a random key
const key = crypto.randomBytes(32);
// Generate a random initialization vector (IV)
const iv = crypto.randomBytes(12);

// Encrypt the text
const plainText = 'Hello World';
const encryptedResult = encrypt(plainText, key, iv);
console.log('Encrypted: ', encryptedResult.content);

// Decrypt the text
const decryptedResult = decrypt(encryptedResult.content, key, iv, encryptedResult.tag);
console.log('Decrypted: ', decryptedResult);

