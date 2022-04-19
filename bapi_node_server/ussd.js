const express = require('express')
http = require('http')
app = express()
server = http.createServer(app)
const {http_response} = require('./HTTP.js')
const bodyPaser = require('body-parser')
io = require('socket.io').listen(server)
require('dotenv').config()

const port = process.env.PORT || process.env.PORT_USSD;

app.use(bodyPaser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res, next) => {
    res.send(`ussd Server is running on port ${port}`)
});

app.post('/sendMoney', (req, res, next) => {
    try{
        let hash = "75d1d4be";
        let ussdData = {
            amount : req.body.amount,
            phone : req.body.phone,
            txid : req.body.txid,
            request : req.body.request, // must be sendMoney
            hash : hash
        }
        io.emit('ussd', ussdData)
        console.log(ussdData)
        let http_data = {data: ussdData, socket : true}
        http_response(res, http_data, 200)
    }catch(e) {
        let http_data = {error: e.message, socket : false}
        http_response(res, http_data, 500)
    }
}); 


app.get('/getBalance', (req, res, next) => {

    let ussdData = {
        request : "getBalance",
    }

    io.emit('ussd',ussdData)
    res.json({ussdData:ussdData})
});

io.on('connection', (socket) => {

    /**
     * 
     * GLOBAL SOCKET MANAGE
     */

    console.log(`user ${socket.id} connected`)

    socket.on('join', function(userNickname) {

        console.log(userNickname +" : has connected to the server "  );

        socket.emit('userjoinedthechat',userNickname + " : has connected to the server ");
    })

    socket.on('messagedetection', (senderNickname,messageContent) => {
        console.log(senderNickname + " : " + messageContent)
        let  message = {
            "message": messageContent, 
            "senderNickname":senderNickname
        }
        io.emit('message', message )
        io.emit('ping', `Ping by ${senderNickname} has been successfully`)
    })

    socket.on('disconnect', function() {
        console.log(' user has left ')
        socket.broadcast.emit( "userdisconnect" ,' user has left')
    })


    /**
     * 
     * USSD SOCKET MANAGE
     */

    socket.on('insufficientBalance', function(balance, amount) {

        console.log(`Insufficient balance: ${balance} || ${amount}`);

    })


    socket.on('updateBalance', function(balance) {

        console.log(`Update balance to ${balance}`);

        /**
         * Request to update the balance on database
         */

    })



})


server.listen(port, "0.0.0.0", () => {
    console.log(`BAPI ussd app is running on port ${port}`);
})
