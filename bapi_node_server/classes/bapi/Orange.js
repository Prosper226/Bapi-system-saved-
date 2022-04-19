'use strict';

// MODELES

const Orange_md = require('../../models/bapi/Orange');



// PACKAGES 

const { ECONNREFUSED } = require('constants');
const orderid = require('order-id')('key');

require('dotenv').config()


// CLASSES




module.exports = class Orange {

    constructor() {

    }

    /**
     * 
     * @param {*} input JSON Data
     * @returns code, message
     */
    async create(input){
        try{
            const data = {
                transId: input.transId,
                amount: input.amount,
                phone: input.phone,
                type: input.type,
                balance : input.newBalance,
                message : input.message
            }

            const notification_Orange = new Orange_md(data) 

            return await notification_Orange.save()
            .then((notification) => {
                if(notification){
                    return notification
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

}