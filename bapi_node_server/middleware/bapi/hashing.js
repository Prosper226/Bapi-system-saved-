const {decrypt} = require('../../classes/bapi/Crypted')
require('dotenv').config()

module.exports = (req, res, next) => {
    try{
        const encryptedMessage = req.body.crypted
        if(encryptedMessage){
            var decryptedMessage = decrypt(encryptedMessage)
            console.table(((decryptedMessage)))
            Object.entries(decryptedMessage).forEach(([key, value]) => {
                req.body[key] = value
            })
            next()
        }else{
            res.status(401).json({error: 'Query not matched'})
        }    
    }catch(error){
        res.status(401).json({error: error | 'Requete non authentifiee'})
    }
}; 