'use strict';

// MODELES

const Zombie_md = require('../../models/bapi/Zombie');



// PACKAGES 

const { ECONNREFUSED } = require('constants');
const orderid = require('order-id')('key');

require('dotenv').config()


// CLASSES




module.exports = class Zombie {

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
                message : input.message
            }

            const notification_zombie = new Zombie_md(data) 

            return await notification_zombie.save()
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

    async find_zombie_deposit_transaction(data){
        return Zombie_md.findOne({phone: data.phone, amount: data.amount, type: 'deposit', restitute: false})
        .then((zombie) => {
            if(zombie){
                return zombie
            }else{
                return false
            }
        })
        .catch((err) => {throw new Error(err.message)})
    }


    async update_zombie_as_restitute(source, destination){
        try{
            let updated_at = Math.floor(Date.now() / 1000)
            return Zombie_md.updateOne({ transId: source}, { restitute: destination, updated_at: updated_at })
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

}