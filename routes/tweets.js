
const router = require('express').Router()
const mongoose = require('mongoose')
const passport = require('passport')
const user = require('../models/users.js')
const Tweet = require('../models/tweets.js')
const Comment = require('../models/comments.js')
const{ isLoggedIn} = require("../middleware")
router.post('/',isLoggedIn,async(req,res)=>{
   const obj = {text:req.body.tweet,author:req.user.id}
   const tweet = new Tweet(obj)
   await tweet.save()
   res.redirect('/')
})
router.get('/:id',async(req,res)=>{
    const tweet = await Tweet.findById(req.params.id).populate({
        path: 'comments',
        populate:{
            path:'author'
        }
    })
    const username = await user.findById(tweet.author)
    console.log(tweet.comments)
    res.render('../views/comments',{comments:tweet.comments,author:username,text:tweet.text})

 })
 router.post('/:id',isLoggedIn,async(req,res)=>{
    userid = mongoose.Types.ObjectId(req.user.id)
    tweetid = mongoose.Types.ObjectId(req.params.id)
    var tweet = await Tweet.findOne({_id:tweetid,likes:userid});
    if (tweet==null){
        tweet = await Tweet.findOne({_id:tweetid})
        tweet.likes.push(req.user.id);
        tweet.save()
    }
    else{
        tweet.likes.remove(userid);
        tweet.save()
    }
    res.redirect('/')
 })
router.post('/:id/comments',isLoggedIn,async(req,res)=>{
    const tweet = await Tweet.findById(req.params.id)
    const obj = {text:req.body.commenttext,author:req.user.id}
    const comment = new Comment(obj)

    tweet.comments.push(comment)
    comment.save()
    tweet.save()
    res.redirect('/tweets/'+req.params.id)
 })
 
module.exports=router