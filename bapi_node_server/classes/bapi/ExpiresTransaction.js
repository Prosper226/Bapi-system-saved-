'use strict';

// MODELES

const ExpiresTransaction_md = require('../../models/bapi/ExpiresTransaction');



// PACKAGES 

const { ECONNREFUSED } = require('constants');
const orderid = require('order-id')('key');

require('dotenv').config()


// CLASSES




module.exports = class ExpiresTransaction {

    constructor() {

    }

    /**
     * 
     * @param {*} input JSON Data
     * @returns code, message
     */
    async create(transaction){
        
        const expires_transaction = new ExpiresTransaction_md({transaction}) 

        return await expires_transaction.save()
        .then((transaction) => {
            if(transaction){
                return transaction
            }else{
                return false
            }

        })
        .catch(err => {throw new Error(err.message)})

    }

}