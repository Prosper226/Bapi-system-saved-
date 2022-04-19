const crypto = require('crypto');
require('dotenv').config()

const encryptionMethod = process.env.HASH_ALGORITHM
const secret = process.env.HASH_SECRET
const iv = secret.substr(0,16)

const secretSocket = process.env.SOCKET_HASH_SECRET;
const ivSocket = secretSocket.substr(0,16)

exports.encrypt = (plain_text) => {
    const encryptor = crypto.createCipheriv(encryptionMethod, secret, iv)
    return encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64')
};

exports.decrypt = (encryptedMessage) => {
    const decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
    return JSON.parse(decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8'));
};

exports.encryptSocket = (plain_text) => {
    const encryptor = crypto.createCipheriv(encryptionMethod, secretSocket, ivSocket);
    return encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64')
};

exports.decryptSocket = (encryptedMessage) => {
    const decryptor = crypto.createDecipheriv(encryptionMethod, secretSocket, ivSocket);
    return JSON.parse(decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8'));
};
