'use strict';

// MODELES

const Transaction_md = require('../../models/bapi/Transaction');



// PACKAGES 

const { ECONNREFUSED } = require('constants');
const orderid = require('order-id')('key');

require('dotenv').config()


// CLASSES




module.exports = class Transaction {

    constructor() {

    }

    /**
     * 
     * @param {*} input JSON Data
     * @returns code, message
     */
    async create(input){
        let transId = await this.generate_uid();
        let created_at = Math.floor(Date.now() / 1000)
        let expireIn = Math.floor(Date.now() / 1000) + 600
        const data = {
            transId: transId,
            bash : input.bash,
            amount: input.amount,
            phone: input.phone,
            type: input.type,
            created_at: created_at,
            updated_at: created_at,
            expireIn: expireIn
        }

        const transaction = new Transaction_md(data) 

        return await transaction.save()
        .then((transaction) => {
            if(transaction){
                return transaction
            }else{
                return false
            }

        })
        .catch(err => {throw new Error(err.message)})

    }


    /**
     * 
     * @param {*} transId 
     * @returns 
     */
    async find_transact_to_achieve(phone, amount, type){

        return Transaction_md.findOne({phone: phone, amount: amount, type: type, status: 0})
        .then((transaction) => {
            if(transaction){
                return transaction
            }else{
                return false
            }
        })
        .catch((err) => {throw new Error(err.message)})
    }


    async find_transact_by_transid(transId){

        return Transaction_md.findOne({transId: transId})
        .then((transaction) => {
            if(transaction){
                return transaction
            }else{
                return false
            }
        })
        .catch((err) => {throw new Error(err.message)})
    }



    async update_transaction_to_achieve(transId, status, orange_transId){
        try{
            let updated_at = Math.floor(Date.now() / 1000)
            return Transaction_md.updateOne({ transId: transId, status: 0, }, { status: status, orange_transId: orange_transId, updated_at: updated_at })
                .then((update) => {
                    if(update){
                        return update
                    }else{
                        return false
                    }
                })
                .catch((err) => {throw new Error (err.message)})
        }catch(e){
            throw new Error (e.message)
        }
    }


    async generate_uid(){
        try{
            do{
                var uid = `${orderid.generate()}`;
                var available_uid = await this.available_uid(uid);
            }while(! available_uid)
            return uid
        }catch(e){
            throw new Error (e.message)
        }
    }

    /**
     * 
     * @param {*} uid 
     * @returns 
     */
    async available_uid(transId){

        return Transaction_md.findOne({transId: transId})
        .then((transaction) => {
            if(transaction){
                return false
            }else{
                return true
            }
        })
        .catch((err) => { 
            throw new Error(err.message)
        })
    
    }


    async delete_exprires_transaction(){
        console.log('deleting')
        try{
            let actual = Math.floor(Date.now() / 1000)
            return Transaction_md.deleteMany({expireIn: { $lt: actual }, status: 0})
            .then((deleted) => {
                if(deleted){
                    return deleted
                }else{
                    return false
                }
            })
            .catch(err => {
                throw new Error (err.message)
            })
        }catch(e){
            throw new Error (e.message)
        }
    }


    async find_exprires_transaction(){
        try{
            let actual = Math.floor(Date.now() / 1000)
            return Transaction_md.find({expireIn: { $lt: actual }, status : 0})
            .then((expires) => {
                if(expires){
                    return expires
                }else{
                    return false
                }
            })
            .catch(err => {
                throw new Error (err.message)
            })
        }catch(e){
            throw new Error (e.message)
        }
    }


    async can_create_credential(input){
        try{

            let phone = input.phone
            let type = input.type

            return Transaction_md.findOne({phone: phone, type: type, status: 0})
            .then((transaction) => {
                if(transaction){
                    return false
                }else{
                    return true
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