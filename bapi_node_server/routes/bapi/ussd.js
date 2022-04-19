/////////////////////////////////////////////////////////////////////////////////////////
// MODULES
const express = require('express');
const router = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////
// CONTROLLERS

const ussdCtrl = require('../../controllers/bapi/ussd')

/////////////////////////////////////////////////////////////////////////////////////////
// MIDDLWARES
const hashing = require('../../middleware/bapi/hashing')


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////



router.get('/', (req, res , next) => {
    res.json('welcome to barkachange ussd');
});

router.post('/merchant/init', ussdCtrl.ussd_init_balance)
router.get('/merchant/balance', ussdCtrl.ussd_get_balance)
router.post('/merchant/update', ussdCtrl.ussd_update_balance)

router.post('/transaction/add/deposit', ussdCtrl.create_deposit_transaction)
router.post('/transaction/add/withdraw', ussdCtrl.create_withdraw_transaction)
router.get('/transaction/check/:transid', ussdCtrl.check_transaction)


router.post('/orange/notify', ussdCtrl.ussd_orange_transaction)

router.post('/alert/intrusion', ussdCtrl.ussd_detect_intrusions)

router.post('/vhash', ussdCtrl.vhash)

module.exports = router;    