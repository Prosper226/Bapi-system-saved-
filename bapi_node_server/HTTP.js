// PACKAGES

const qs = require('qs');
const axios = require('axios');

// CLASSES
// const HASH = require("./classes/bapi/Hash")
// var hash = new HASH()

// LIBRAIRIES


/**
 * 
 * @param {*} res 
 * @param {*} response 
 * @param {*} status 
 * @param {*} response_code 
 * @param {*} crypted 
 */
exports.http_response = async (res, response, status, response_code = null,crypted = true) => {
    try{

        
        let my_json = {code : status}
        if(response_code){
            my_json.code = response_code
        }
        for(var attributename in response){
            my_json[attributename] = response[attributename]
        }
        
        if(crypted){
            // en production my_json doit etre cryptee avant de restituer la reponse
            // my_json = await hash.encrypt(JSON.stringify(my_json))
            // let dec = await hash.decrypt(JSON.stringify(my_json))
            console.log(my_json)
            res.status(status).json(my_json)
        }else{
            // affichage brute
            res.status(status).json(my_json)
        }
        
    }catch(e){
        throw new Error (e.message)
    }
}


exports.makeRequest = async (method, body, endpoind, headers = {}) => {
    try{
        console.log({endpoind, method, body, headers})
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