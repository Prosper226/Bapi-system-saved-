const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const zombieSchema = mongoose.Schema({
    transId : { type: String, required: true, unique: true},
    created_at : {type: Number, required: true, default: (Math.floor(Date.now() / 1000))},
    amount : { type: Number, required: true},
    phone : { type: String, required: true},
    type : { type: String, required: true},
    message : { type: String, required: true},
    updated_at : {type: Number , default: (Math.floor(Date.now() / 1000))},
    restitute: { type: String, required: true, default: false}
});

zombieSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Zombie', zombieSchema);
