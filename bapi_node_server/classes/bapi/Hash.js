'use strict';

// MODELES



// PACKAGES 

const crypto = require('crypto');
require('dotenv').config()


// CLASSES




module.exports = class Hash {

    constructor() {
        this.encryption_method = process.env.HASH_ALGORITHM
        this.secret = process.env.HASH_SECRET
        this.iv = this.secret.substr(0,16)
    }


    async encrypt(plain_text) {

        const encryptor = crypto.createCipheriv(this.encryption_method, this.secret, this.iv)
        return encryptor.update(`${plain_text}`, 'utf8', 'base64') + encryptor.final('base64')

    }



    async decrypt(encrypted_message){
        const decryptor = crypto.createDecipheriv(this.encryption_method, this.secret, this.iv);
        return JSON.parse(decryptor.update(encrypted_message, 'base64', 'utf8') + decryptor.final('utf8'));
    }


}