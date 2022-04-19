const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const expiresTransactionSchema = mongoose.Schema({
    transaction : { type: {}, required: true},
    created_at : {type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
});

expiresTransactionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ExpiresTransaction', expiresTransactionSchema);

