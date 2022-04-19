'use strict';

// PACKAGES 

var sha1 = require('sha1');
require('dotenv').config()



// LIBRAIRIES
const {makeRequest} = require('../../HTTP.js')



// CLASSES

const TRANSACTION = require('./Transaction')
var transaction = new TRANSACTION()

const EXPIRES_TRANSACTION = require('./ExpiresTransaction')
var expires_transaction = new EXPIRES_TRANSACTION()


module.exports = class Crontab {

    constructor() {
        this.delete_expire_transaction_TIMER = 1000 * 30 // per 1 minute timeout
    }



    async delete_expire_transaction(){
        try{

            return await setInterval(async () => {

                console.log(`DELETE EXPIRES TRANSACTIONS`)
                var find_transaction = await transaction.find_exprires_transaction()
                for(let i = 0; i < find_transaction.length; i++){
                    let expires = await expires_transaction.create(find_transaction[i])
                    let complete = display_transaction_data(find_transaction[i])
                    complete.orange_transId = "undefined"
                    let vhash = await create_vhash_sha1(complete)
                    complete.vhash = vhash
                    let body = complete
                    body.code = 422
                    body.message = "transaction expires"

                    try{
                        let endpoind = process.env.FAILED_STATUS_URL
                        let callback = await makeRequest("POST", body, endpoind, {})
                        let delete_transaction = await transaction.delete_exprires_transaction()
                        console.table(delete_transaction)
                    }catch(e){
                        console.log(e)
                    }
                }
            }, this.delete_expire_transaction_TIMER); 

        }catch(e){
            // throw new Error (e.message)
            console.log(e.message)
        }

    }

}

async function create_vhash_sha1(data){
    try{
        let request_hour = new Date().getHours() 
        request_hour = (request_hour < 10)?`0${request_hour}`:request_hour
        // console.log((`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`))
        let vhash =  sha1(sha1(sha1(`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`)))
        return vhash
    }catch(e){
        throw new Error(e.message)
    }
}


function display_transaction_data(transaction){
    try{
        transaction = {
            "transId": transaction.transId,
            "bash": transaction.bash,
            "amount": transaction.amount,
            "phone": transaction.phone,
            "type": transaction.type,
            "status": transaction.status,
            "created_at": transaction.created_at,
            orange_transId: transaction.orange_transId
        }
        return transaction
    }catch (err) {
        throw new Error(err.message)
    }
}
