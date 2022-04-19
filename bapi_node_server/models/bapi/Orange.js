const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const orangeSchema = mongoose.Schema({
    transId : { type: String, required: true, unique: true},
    created_at : {type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
    amount : { type: Number, required: true},
    phone : { type: String, required: true},
    type : { type: String, required: true},
    balance: { type: Number, required: true},
    message : { type: String, required: true}
});

orangeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Orange', orangeSchema);
