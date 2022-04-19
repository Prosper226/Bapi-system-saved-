'use strict';

// MODELES

const Balance_md = require('../../models/bapi/Balance');



// PACKAGES 

const { ECONNREFUSED } = require('constants');
const orderid = require('order-id')('key');

require('dotenv').config()


// CLASSES




module.exports = class Balance {

    constructor() {

    }

    /**
     * 
     * @param {*} amount 
     * @param {*} phone 
     * @returns 
     */
    async init(amount, phone){
        try{
            const account_orange = new Balance_md({phone, amount}) 

            return await account_orange.save()
            .then((account) => {
                if(account){
                    return account
                }else{
                    return false
                }
            })
            .catch(err => {
                throw new Error (err.message)
            })
        }catch(e) {
            throw new Error (e.message)
        }
    }

    /**
     * 
     * @param {*} amount 
     * @param {*} phone 
     * @returns 
     */
    async update(amount, phone){
        try{
            let updated_at = Math.floor(Date.now() / 1000)
            return Balance_md.updateOne( {phone: phone}, {amount : amount, updated_at : updated_at})
                .then((update) => {
                    if(update){
                        return update
                    }else{
                        return false
                    }
                })
                .catch(err => {
                    throw new Error (err.message)
                })
        }catch(e) {
            throw new Error (e.message)
        }
    }


    /**
     * 
     * @param {*} phone 
     * @returns 
     */
    async getBalance(phone){
        try{
            return Balance_md.findOne({phone: phone})
            .then((account) => {
                if(account){
                    return account
                }else{
                    return false
                }
            })
            .catch((err) => { 
                throw new Error (err.message)
            })
        }catch(e){
            throw new Error (e.message)
        }
    }


}