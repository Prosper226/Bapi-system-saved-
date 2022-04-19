// PACKAGES

const qs = require('qs');
const axios = require('axios');
const {http_response} = require('../../HTTP.js')
var sha1 = require('sha1');
require('dotenv').config()

// CLASSES

const Balance =  require('../../classes/bapi/Balance');
var BALANCE = new Balance();

const Transaction =  require('../../classes/bapi/Transaction');
var TRANSACTION = new Transaction();

const Orange =  require('../../classes/bapi/Orange');
var ORANGE = new Orange();

const Zombie =  require('../../classes/bapi/Zombie');
var ZOMBIE = new Zombie();

const Sender =  require('../../classes/bapi/Sender');
var SENDER = new Sender();


exports.vhash = async (req, res, next) => {
    try{
        let data = req.body
        let vhash = await create_vhash_sha1(data)
        let http_data = {message: vhash}
        http_response(res, http_data, 200)
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}


exports.ussd_detect_intrusions = async (req, res, next) => {
    try{
        let message = req.body.message;
        let count = await alert_instrusion_now(message)
        let http_data = {message: message, count: count}
        http_response(res, http_data, 200)
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ussd_orange_transaction =   async (req, res, next) => {
    try{
        let op = await orange_complete_process(req.body)
        let merchant_phone = req.body.merchant_phone | process.env.MERCHANT_DEFAULT_PHONE
        let amount = req.body.newBalance
        let updated = await updateBalance(amount, merchant_phone)
        console.log(updated)
        http_response(res, op, 200)
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ussd_init_balance = async (req, res, next) => {
    try{
        let merchant_phone = req.body.merchant_phone | process.env.MERCHANT_DEFAULT_PHONE
        let amount = req.body.amount | 0
        let initiate = await initBalance(amount, merchant_phone)
        if(initiate){
            let http_data = {message: "success", account : display_merchant_data(initiate)}
            http_response(res, http_data, 201)
        }else{
            let http_data = {message: "failed"}
            http_response(res, http_data, 200)
        }
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ussd_update_balance = async (req, res, next) => {
    try{
        let merchant_phone = req.body.merchant_phone | process.env.MERCHANT_DEFAULT_PHONE
        let amount = req.body.amount
        let updated = await updateBalance(amount, merchant_phone)
        console.log({updated})
        if(updated){
            let http_data = {message: updated.matchedCount}
            http_response(res, http_data, 200)
        }else{
            let http_data = {message: "not found"}
            http_response(res, http_data, 404)
        }
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ussd_get_balance = async (req, res, next) => {
    try{
        let merchant_phone = req.body.merchant_phone | process.env.MERCHANT_DEFAULT_PHONE
        let account = await getBalance(merchant_phone)
        console.log({account})
        if(account){
            let http_data = {data: display_merchant_data(account), success: true}
            http_response(res, http_data, 200)
        }else{
            let http_data = {error: "merchant not found"}
            http_response(res, http_data, 404)
        }
    }catch(e){
        let http_data = {error: e.message}
        http_response(res, http_data, 500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create_deposit_transaction = async (req, res, next) => {
    try{
        let phone = req.body.phone
        let str_phone = phone.toString().substring(0, 3)
        let phonenumber = phone.toString().split(str_phone)[1]
        let check_data = {
            phone : phonenumber, // req.body.phone,
            type : 'deposit'
        }
        let can_add_trans = await TRANSACTION.can_create_credential(check_data)
        if(can_add_trans){
            console.log(phonenumber)
            let data = {
                bash : req.body.bash,
                amount : req.body.amount,
                phone: phonenumber,
                type : "deposit"
            } 
            let  add_transaction = await TRANSACTION.create(data)
            if(add_transaction){
                let http_data = {data: display_transaction_data(add_transaction), success : true}
                http_response(res, http_data, 201, 200)
            }else{
                let http_data = {error: "failure to create the transaction", success: false}
                http_response(res, http_data, 200, 400)
            }
        }else{
            let http_data = {error: "a deposit transaction is already in progress for this phone number", success: false}
            http_response(res, http_data, 200, 400)
        }
    }catch(e) {
        let http_data = {error: e.message, success: false}
        http_response(res, http_data, 500)
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create_withdraw_transaction = async (req, res, next) => {
    try{

        let phone = req.body.phone
        let str_phone = phone.toString().substring(0, 3)
        let phonenumber = phone.toString().split(str_phone)[1]

        let check_data = {
            phone : phonenumber, // req.body.phone,
            type : 'withdrawal'
        }
        let can_add_trans = await TRANSACTION.can_create_credential(check_data)
        if(can_add_trans){

            // check amount
            let merchant_phone = process.env.MERCHANT_DEFAULT_PHONE
            var account_balance = await getBalance(merchant_phone)
            console.log({merchant_phone, account_balance})
            if(account_balance.amount >= req.body.amount){
                
                console.log(phonenumber)
                let data = {
                    bash : req.body.bash,
                    amount : req.body.amount,
                    phone:  phonenumber, //req.body.phone,
                    type : "withdrawal"
                }
                let  add_transaction = await TRANSACTION.create(data)
                if(add_transaction){
                    // emit socket ussd send money
                    try{
                        
                        var body = {
                            "amount" : req.body.amount,
                            "phone" : phonenumber, // req.body.phone,
                            "txid" : add_transaction.transId,
                            "request" : "sendMoney", 
                        }
                        var endpoind = process.env.BAPI_SEND_MONEY_ENDPOINT
                        let send_money = await makeRequest("POST", body, endpoind, {})
                        let http_data = {data: display_transaction_data(add_transaction), success: send_money.socket}
                        http_response(res, http_data, 201, 200)
                    
                    }catch(ex) {
                        // ignore
                        console.log(ex.message)
                    }
                }else{
                    let http_data = {error: "failure to create the transaction", success: false}
                    http_response(res, http_data, 200, 400)
                }
            }else{
                let http_data = {error: "insufficient balance to initiate this new transaction", success: false}
                http_response(res, http_data, 200, 402)
            }
        }else{
            let http_data = {error: "a withdrawal transaction is already in progress for this phone number", success: false}
            http_response(res, http_data, 200, 400)
        }
    }catch(e) {
        let http_data = {error: e.message, success: false}
        http_response(res, http_data, 500)
    }

}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.check_transaction = async (req, res, next) => {
    try{
        console.log(req.params)
        trans_id = req.params.transid
        console.log(trans_id)
        let transaction = await TRANSACTION.find_transact_by_transid(trans_id)
        if(transaction){
            let http_data = {message: "succes", transaction: display_transaction_data(transaction)}
            http_response(res, http_data, 200)
        }else{
            let http_data = {message: "transaction not found"}
            http_response(res, http_data, 404)
        }
    }catch(e){
        let http_data = {message: e.message}
        http_response(res, http_data, 500)
    }
}

/**
 * 
 * @param {*} transaction 
 * @returns 
 */
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


/**
 * 
 * @param {*} account 
 * @returns 
 */
function display_merchant_data(account){
    try{
        account = {
            "phone": account.phone,
            "amount": account.amount,
            "created_at": account.created_at,
            "updated_at": account.updated_at,
        }
        return account
    }catch (err) {
        throw new Error(err.message)
    }
}


/**
 * 
 * @param {*} amount 
 * @param {*} phone 
 * @returns 
 */
async function updateBalance(amount, phone) {
    try{
        // update balance
        let resu = await BALANCE.update(amount, phone)
        return resu
    }catch(e){
        throw new Error (e.message)
    }
}

/**
 * 
 * @returns 
 */
async function getBalance(phone) {
    try{
        // get balance amount
        let resu = await BALANCE.getBalance(phone)
        return resu
    }catch(e) {
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} amount 
 * @param {*} phone 
 * @returns 
 */
async function initBalance(amount, phone) {
    try{
        // init balance amount
        let resu = await BALANCE.init(amount, phone)
        return resu
    }catch(e) {
        throw new Error(e.message)
    }
}



/**
 * 
 * @param {*} data 
 * @returns 
 */
async function add_orange_notification(notify){
    try{
        // add new transcation
        let resu = await ORANGE.create(notify)
        return resu
    }catch(e){
        throw new Error(e.message)
    }
}


/**
 * 
 * @param {*} method 
 * @param {*} body 
 * @param {*} endpoind 
 * @param {*} headers 
 * @returns 
 */
async function makeRequest(method, body, endpoind, headers = {}) {
    try{

        body = (method == "GET")?qs.stringify(body):body
        var options = {
            url: endpoind,
            method: method,
            data : body,
            headers: headers,
        };
        return axios(options)
        .then(response => {return response.data})
        .catch(err => {
            throw new Error(err.message)
        })
    }catch(e) {
        throw new Error(e.message)
    }

}

/**
 * 
 * @param {*} body 
 * @param {*} endpoind 
 * @param {*} headers 
 * @returns 
 */
async function postRequest(body, endpoind, headers = {}) {
    try{
        const options = {
            url: endpoind,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: body
        };
        
        return axios(options)
        .then(response => {return response})
        .catch(err => { throw new Error(err.message)})
    }catch(e) {
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} body 
 * @param {*} endpoind 
 * @param {*} headers 
 * @returns 
 */
async function getRequest(body, endpoind, headers = {}) {
    try{
        const options = {
            url: endpoind,
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: qs.stringify(body)
        };
        
        return axios(options)
        .then(response => {return response})
        .catch(err => { throw new Error(err.message)})
    }catch(e) {
        throw new Error(e.message)
    }
}

async function orange_transaction_notification(data) {
    try{
        let notification_Orange = data
        let notification = await add_orange_notification(notification_Orange)
        if(notification){
            
            let phone = notification.phone
            let amount = notification.amount
            let type = notification.type

            let transaction = await TRANSACTION.find_transact_to_achieve(phone, amount, type)
            if(transaction){

                let transId = transaction.transId
                let orange_transId = notification.transId
                let update_trans = await TRANSACTION.update_transaction_to_achieve(transId, 1, orange_transId)
                
                if(update_trans){
                    let http_data = {message: "success", notification : notification, transaction: transaction, update : update_trans}
                    return http_data
                }else{
                    let http_data = {message: "fail", notification : notification, transaction: transaction}
                    return http_data
                }
                
            }else{
                let add_zombie_transaction = await ZOMBIE.create(notification) 
                let http_data = {message: "zombie", notification : add_zombie_transaction}
                return http_data
            }
        }else{
            let http_data = {message: "failed to create orange transaction notification"}
            return http_data
        }
    }catch(e){
        throw new Error(e.message)
    }
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
async function orange_complete_process(data){
    try{
        let notification = await orange_notification_creation(data)
        if(notification){
            let transaction = await find_transaction_according_to_the_orange_notification(notification)
            if(transaction){
                let update_trans = await update_transaction_as_achieve(transaction, notification)
                // console.log({update_trans})
                console.log(`io.emit('complete_transaction', ${update_trans})`)
                return update_trans
            }else{
                let zombie = await create_copy_of_orange_notification_on_zombie(notification)
                console.log({zombie})
            
                if(data.type === 'deposit'){
                    //  renvoyer la somme au deposant
                    try{          
                        var body = {    
                            "amount" : data.amount,
                            "phone" : data.phone,
                            "txid" : `restitute deposit for ${data.transId}`,
                            "request" : "sendMoney", 
                        }
                        var endpoind = process.env.BAPI_SEND_MONEY_ENDPOINT
                        let send_money = await makeRequest("POST", body, endpoind, {})
                        console.log({restitute: data, success: send_money.socket})
                    }catch(ex) {
                        console.log(ex.message)
                    }
                }else{
                    //  verifier si ya correspondance avec un depot zombie non paye
                    let zombie_transaction = await ZOMBIE.find_zombie_deposit_transaction(zombie)
                    if(zombie_transaction){
                        //  MAJ du zombie (depot et retrait)
                        let update_zombie_deposit = await ZOMBIE.update_zombie_as_restitute(zombie_transaction.transId, zombie.transId)
                        let update_zombie_withdrawal = await ZOMBIE.update_zombie_as_restitute(zombie.transId, zombie_transaction.transId)
                        console.log({update_zombie_withdrawal, update_zombie_deposit})
                        return update_zombie_withdrawal
                    }
                }
                
                return zombie
                
                /**
                 *  
                 * voir le type de l'operation
                 * si depot,
                 *      renvoyer le montant au deposant initial
                 * sinon si retrait
                 *      verifier si ya correspondance avec un depot zombie non paye
                 *      si correspondance,
                 *          MAJ du zombie (depot et retrait)
                 *      sinon
                 *          rien n'est fait
                 *  
                 * Ajouter, un champs qui precisant si le zombie est restitue ou pas
                 * et un champ qui prend le transid de l'operation contraire qui lui est associee
                 *  
                 */
            }
        }else{
            console.log({notification})
            return notification // false
        }
    }catch(e){
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} data 
 * @returns 
 */
async function orange_notification_creation(data){ // orange notification creation
    try{
        let notification_Orange = data
        let notification = await add_orange_notification(notification_Orange)
        return notification
    }catch(e){
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} notification 
 * @returns 
 */
async function find_transaction_according_to_the_orange_notification(notification){ // find transaction according to the orange notification
    try{
        let phone = notification.phone
        let amount = notification.amount
        let type = notification.type
        let transaction = await TRANSACTION.find_transact_to_achieve(phone, amount, type)
        return transaction
    }catch(e){
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} notification 
 * @returns 
 */
async function create_copy_of_orange_notification_on_zombie(notification){ // create copy of orange notification on zombie 
    try{
        let add_zombie_transaction = await ZOMBIE.create(notification) 
        return add_zombie_transaction
    }catch(e){
        throw new Error(e.message)
    }
}

/**
 * 
 * @param {*} transaction 
 * @param {*} notification 
 * @returns 
 */
async function update_transaction_as_achieve(transaction, notification){ // update transaction as achieve
    try{
        let transId = transaction.transId
        let orange_transId = notification.transId
        let update_trans = await TRANSACTION.update_transaction_to_achieve(transId, 1, orange_transId)
        // let completed_transaction_data = await TRANSACTION.find_transact_by_transid(transId)
        transaction.status = 1
        transaction.orange_transId = orange_transId
        return display_transaction_data(transaction)
    }catch(e){
        throw new Error(e.message)
    }
}


/**
 * 
 * @param {*} name 
 * @param {*} message 
 * @returns 
 */
async function alert_intrusion_schema(name, message){
    try{
        let alert = `Hi ${name},\nThe PMUFLASH BAPI system has just detected an unusual message.\nContent: << ${message} >>.\nPlease take measures to limit the damage.`;
        return alert;
    }catch(e){
        throw new Error(e.message)
    }
}


/**
 * 
 * @param {*} message 
 * @returns 
 */
async function alert_instrusion_now(message){
    try{
        let administrators = [
            {name: "Prosper", address: 57474578},
            {name: "Haemasu", address: 60565103},
            // {name: "Anicet", phone: 67171006},
            // {name: "Youmanly", phone: 76615699},
        ]

        var send = 0
        for (let i = 0; i < administrators.length; i++) { 
            let body = {
                address: administrators[i].address,
                message: await alert_intrusion_schema(administrators[i].name, message)
            }
            let send_sms = await SENDER.send_sms(body)
            if(send_sms){send++;}
            let send_sms_response = {message: body, success: send_sms}
            console.log(send_sms_response)
        }
        return send
    }catch(e){
        throw new Error(e.message)
    }
}

async function create_vhash_sha1(data){
    try{
        let timestamp = data.created_at * 1000
        let request_hour = new Date(timestamp).getHours() 
        console.log((`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`))
        let vhash =  sha1(sha1(sha1(`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`)))
        return vhash
    }catch(e){
        throw new Error(e.message)
    }
}