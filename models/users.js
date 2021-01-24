const mongoose = require('mongoose');
const PLM = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    displayname:{
        type:String,
        required:true
    }

})
user.plugin(PLM);
module.exports = mongoose.model('User',user)