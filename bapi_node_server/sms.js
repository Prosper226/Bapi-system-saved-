const mongoose = require('mongoose');
const express = require('express')

const qs = require('qs');
const axios = require('axios');
var sha1 = require('sha1');
http = require('http')
app = express()
server = http.createServer(app)
const bodyPaser = require('body-parser')
io = require('socket.io').listen(server)
require('dotenv').config()

const port = process.env.PORT || process.env.PORT_SMS;

const appName = process.env.APP_NAME || 'BAPI'

mongoose.connect(process.env.DATABASE,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    ) 
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/**
 *  START
 */


const Balance =  require('./classes/bapi/Balance');
var BALANCE = new Balance();

const Orange =  require('./classes/bapi/Orange');
var ORANGE = new Orange();

const Sender =  require('./classes/bapi/Sender');
var SENDER = new Sender();

const Transaction =  require('./classes/bapi/Transaction');
var TRANSACTION = new Transaction();

const Zombie =  require('./classes/bapi/Zombie');
var ZOMBIE = new Zombie();


const critical_stop_balance = process.env.CRITICAL_STOP_BALANCE

/**
  *  END
  */

app.use(bodyPaser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res, next) => {
    res.send(`sms Server is running on port ${port}`)
});



app.get('/socket', async (req, res, next) => {
    try{

        let http_data = {message: "test socket linked"}
        io.emit('socket_php', http_data)
        http_response(res, http_data, 200)

    }catch(e){
        let htp_data = {message: e.message}
        http_response(res, http_data, 500)
    }

});



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
 * @param {*} phone 
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
 * @param {*} notify 
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
                console.log({update_trans, operation: update_trans.type})
                io.emit('complete_transaction', update_trans)
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
                        
                    }
                }

                return false
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
 * @param {*} name 
 * @param {*} message 
 * @returns 
 */
async function alert_intrusion_schema(name, message){
    try{
        let alert = `Hi ${name},\nThe ${appName} BAPI system has just detected an unusual message.\nContent: << ${message} >>.\nPlease take measures to limit the damage.`;
        return alert;
    }catch(e){
        throw new Error(e.message)
    }
}

async function alert_critical_balance_schema(name, message){
    try{
        let alert = `Hi ${name},\nThe ${appName} BAPI account balance is low. \nActual balance is: << ${message} >>.`;
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
            // {name: "Anicet", address: 67171006},
            // {name: "Youmanly", address: 76615699},
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


async function alert_critical_balance(message){
    try{
        let administrators = [
            {name: "Prosper", address: 57474578},
            {name: "Haemasu", address: 60565103},
            // {name: "Anicet", address: 67171006},
            // {name: "Youmanly", address: 76615699},
        ]

        var send = 0
        for (let i = 0; i < administrators.length; i++) { 
            let body = {
                address: administrators[i].address,
                message: await alert_critical_balance_schema(administrators[i].name, message)
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
        let request_hour = new Date().getHours()
        request_hour = (request_hour < 10)?`0${request_hour}`:request_hour
        console.log((`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`))
        let vhash =  sha1(sha1(sha1(`Ambition is priceless:${data.transId}:${data.amount}:${data.phone}:${data.orange_transId}:${data.bash}:${data.created_at}:${request_hour}`)))
        return vhash
    }catch(e){
        throw new Error(e.message)
    }
}


io.on('connection',async (socket) => {

    const merchant_phone = process.env.MERCHANT_DEFAULT_PHONE

    console.log('#####################################################')
    console.log(`The message detection application is active.`)
    let response = await getBalance(merchant_phone)
    if(response){
        console.log(`Actual balance is ${response.amount}`)
    }else{
        console.error(`failed check balances`)
    }
    console.log('#####################################################')



    socket.on('balanceOperation', async (balance)  => {

        console.log(`Balance operation has detected:`);

        let balanceTable = {'balance': balance};

        console.table(balanceTable)

        // update the balance
        let response = await updateBalance(balance, merchant_phone)
        console.log(response)

        if(balance <= critical_stop_balance){
            let count = await alert_critical_balance(balance)
            console.log({count})
        }

    })



    socket.on('depositOperation', async (phone, amount, transId, newBalance, message) => {
        // check db 
        console.log(`deposit operation has detected:`)

        let depositTable = {
            phone: phone,
            amount: amount,
            transId: transId,
            newBalance: newBalance,
            message : message,
            type : "deposit"
        }

        console.table(depositTable)
        
        // // // add deposit transaction
        // // let response = await add_orange_notification(depositTable)
        // // console.log(response)
        
        // check and update transaction or stage at zombie level
        let complete = await orange_complete_process(depositTable)

        let update_balance = await updateBalance(newBalance, merchant_phone)
        console.table(update_balance)

        if(complete){
            let vhash = await create_vhash_sha1(complete)
            complete.vhash = vhash
            var body = complete
            body.code = 200
            var endpoind = process.env.DEPOSIT_STATUS_URL
            let deposit_callback = await makeRequest("POST", body, endpoind, {})
            console.log({complete})
            console.table({deposit_callback})
        }

        if(newBalance <= critical_stop_balance){
            let count = await alert_critical_balance(newBalance)
            console.log({count})
        }

    })



    socket.on('withdrawalOperation', async (phone, amount, transId, newBalance, message) =>{
        // check db 
        console.log(`withdrawal operation has detected:`)

        let withdrawalTable = {
            phone: phone,
            amount: amount,
            transId: transId,
            newBalance: newBalance,
            message : message,
            type : "withdrawal"
        }

        console.table(withdrawalTable)

        // check and update transaction or stage at zombie level
        let complete = await orange_complete_process(withdrawalTable)
        console.log(complete)
        let update_balance = await updateBalance(newBalance, merchant_phone)
        console.table(update_balance)
        
        if(complete){
            let vhash = await create_vhash_sha1(complete)
            complete.vhash = vhash
            var body = complete
            body.code = 200
            var endpoind = process.env.WITHDRAW_STATUS_URL
            let withdrawal_callback = await makeRequest("POST", body, endpoind, {})
            console.log({complete})
            console.table({withdrawal_callback})
        }

        if(newBalance <= critical_stop_balance){
            let count = await alert_critical_balance(newBalance)
            console.log({count})
        }

    })



    socket.on('alertIntrusion', async (message) =>{

        console.log(`unknown operation has detected:`)
        console.table({message : message})

        // alert admins by sending SMS and Email

        let count = await alert_instrusion_now(message)
        console.log({count})

    })




    socket.on('disconnect', async function() {

        console.log('#####################################################')
        console.log('The message detection application is inactive')
        let response = await getBalance(merchant_phone)
        console.log(`Last balance is ${response.amount}`)
        console.log('#####################################################')

    })


    /**
     * 
     *  SOCKET MANAGE FOR PHP
     * 
     */

    socket.on("php_receive", async (msg) => {

        console.table({php: msg})

    })

    socket.on("php_connect", async (msg) => {
        console.table("php client is connected")
        io.emit('node_connect', "general")

    })

    
    

})


server.listen(port, "0.0.0.0", () => {
    console.log(`BAPI sms app is running on port ${port}`);
})
