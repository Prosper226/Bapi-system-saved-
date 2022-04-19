const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var delay = 3600 * 5 / 60 // correspond a 5 min
const transactionSchema = mongoose.Schema({
    transId : { type: String, required: true, unique: true},
    bash: { type: String, required: true, unique: true},
    amount : { type: Number, required: true},
    phone : { type: String, required: true},
    type : { type: String, required: true},
    status : { type: Number, required: true, default: 0},
    orange_transId: { type: String},
    created_at : {type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
    updated_at: { type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
    expireIn : {type: Number, required: true, default: (Math.floor(Date.now() / 1000) + 600)}
});
/**
 *  status
 *   0 init
 *   1 execute
 */
transactionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Transaction', transactionSchema);

