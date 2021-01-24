const express = require('express')
const passport = require('passport')
const LS = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const mdbstore = require('connect-mongo')(session);


const store = new mdbstore({
  url:'mongodb+srv://vt1138b:OX5lPN1aZDjLdhgJ@cluster0.faeij.mongodb.net/twitterclone?retryWrites=true&w=majority',
  secret:"BestSecretEver#1234",
  touchAfter:24*3600
})
store.on('error',function(e){
  console.log(e)
})
const sessionConfig = {
  store:store,
  name:'twitterClone',
  secret:"BestSecretEver#1234",
  resave:false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires:Date.now()+1000*3600*24*3,
    maxAge:1000*3600*24*3
  }
}
var app = express()

const mongoose = require('mongoose');
const tweet = require('./models/tweets.js')
const comment = require('./models/comments.js')
const user = require('./models/users.js')

app.set('view engine','ejs')
app.use(flash())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LS(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


mongoose.connect('mongodb+srv://vt1138b:OX5lPN1aZDjLdhgJ@cluster0.faeij.mongodb.net/twitterclone?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log("connected");
})
.catch(err=>{
  console.log(err);
})
const db = mongoose.connection;



app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next()
})
app.get('/tw',(req,res)=>{
  console.log(req.params.id)
})
app.get('/',async(req, res)=>{
 
  const tweets = await tweet.find({})
  for(i=0;i<tweets.length;i++){
    const username = await user.findById(tweets[i].author)
    tweets[i].displayname=username.displayname
    tweets[i].handle = username.username.split('@')[0]
  }

  if( req.isAuthenticated())
  res.render('landing',{tweets:tweets,auth:true,name:req.user.displayname}) 
  else{
    res.render('landing',{tweets:tweets,auth:false,name:false})
  }
})

var userRoute = require('./routes/users')
app.use('/users',userRoute)
var tweetRoute = require('./routes/tweets')
app.use('/tweets',tweetRoute)

app.listen(process.env.PORT||3000,()=>{
    console.log('Listening')
})
