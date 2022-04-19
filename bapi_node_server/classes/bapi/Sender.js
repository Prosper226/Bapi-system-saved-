'use strict';

// PACKAGES 


require('dotenv').config()


// MODELES



// LIBRAIRIES
const orangeSms = require("../../libraries/Orange-sms/Orange-sms/orangeSms")


// CLASSES



module.exports = class Sender {

    constructor() {

        this.sms_options = {

            authorization_header: process.env.BARKACHANGE_SMS_SECRET,
            area_code: process.env.BARKACHANGE_SMS_CODE,
            sender_phone: process.env.BARKACHANGE_SMS_SUBSCRIBER_PHONE,
            sender_name: process.env.BARKACHANGE_SMS_NAME
        }

    }


    /**
     * 
     * @param {Object} input 
     * @returns {boolean}
     */
    async send_sms(input){
        try{
            this.sms_options.sms_body = input.message
            this.sms_options.sender_number = input.address
            return orangeSms(this.sms_options)
            .then((responseOrangeSms)=>{
                if(responseOrangeSms.message === "sms sent"){
                    let success = "sms sent"
                    return (success.localeCompare(responseOrangeSms.message))?false:true
                }
            }).catch((error)=>{
                throw new Error (error.message)
            })
        }catch(e){
            throw new Error (e.message)
        }
    }


}
