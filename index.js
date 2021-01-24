const express = require('express')
const passport = require('passport')
const LS = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const mdbstore = require('connect-mongo')(session);


const store = new mdbstore({
  url:'mongodb+srv://vt1138b:OX5lPN1aZDjLdhgJ@cluster0.faeij.mongodb.net/<dbname>?retryWrites=true&w=majority',
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


mongoose.connect('mongodb+srv://vt1138b:OX5lPN1aZDjLdhgJ@cluster0.faeij.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log("connected");
})
.catch(err=>{
  console.log(err);
})
const db = mongoose.connection;



app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next()
})
app.get('/',(req, res)=>{
  if( req.isAuthenticated())
  res.render('landing',{auth:true,name:req.user.displayname}) 
  else{
    res.render('landing',{auth:false,name:false})
  }
})
app.get('/tweet/:id',(req, res)=>{
  res.render('comments') 
})
app.get('/user1',async(req, res)=>{
 const user1 = new user({username:"vishnutejab99@gmail.com",displayname:"Vishnu Teja Bandi"})
  const newuser = await user.register(user1,'password');
  res.send(newuser);
})
var userRoute = require('./routes/users')
app.use('/users',userRoute)


app.listen(process.env.PORT||8080,()=>{
    console.log('Listening')
})
