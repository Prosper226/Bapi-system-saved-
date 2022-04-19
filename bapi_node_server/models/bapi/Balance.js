const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const BalanceSchema = mongoose.Schema({
    phone : { type: Number, required: true, unique: true},
    amount : { type: Number, required: true},
    created_at : {type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
    updated_at: { type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
});

BalanceSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Balance', BalanceSchema);
