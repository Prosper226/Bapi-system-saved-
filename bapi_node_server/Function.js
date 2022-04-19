/**
 * 
 * @param {*} transaction 
 * @returns 
 */
function display_transaction_data(transaction){
    try{
        transaction = {
            "transId": transaction.transId,
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
                // console.log({update_trans})
                console.log(`io.emit('complete_transaction', ${update_trans})`)
                return update_trans
            }else{
                let zombie = await create_copy_of_orange_notification_on_zombie(notification)
                console.log({zombie})
                return zombie
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