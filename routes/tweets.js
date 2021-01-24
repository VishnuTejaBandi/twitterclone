
const router = require('express').Router()
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