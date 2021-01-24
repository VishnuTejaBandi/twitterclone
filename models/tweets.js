const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweet = new Schema({
    text:String,
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
    
})

module.exports = mongoose.model('Tweet',tweet)