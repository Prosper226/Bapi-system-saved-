const express = require('express');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');

const ussdRoutes = require('../routes/bapi/ussd');

const Crontab =  require('../classes/bapi/Crontab');
var crontab = new Crontab();

require('dotenv').config()


mongoose.connect(process.env.DATABASE,
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
    }
  ) 
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(() => console.log('Connexion à MongoDB échouée'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(bodyPaser.json());
app.use('/bapi/ussd', ussdRoutes);



/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

crontab.delete_expire_transaction()



module.exports = app; 