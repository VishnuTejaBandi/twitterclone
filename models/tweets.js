const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweet = new Schema({
    text:String,
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment',
            unique:true
        }],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User', 
            unque:true
        }],
    
})

module.exports = mongoose.model('Tweet',tweet)