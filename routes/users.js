
const router = require('express').Router()
const passport = require('passport')
const user = require('../models/users.js')

router.get('/register',(req,res)=>{
    res.render('signup.ejs')
})
router.get('/login',(req,res)=>{
    res.render('login.ejs')
})
router.post('/register',async(req,res)=>{
    try{
        const {username,displayname,password} = req.body;
    const user1 = new user({username,displayname})
    const newuser = await user.register(user1,password);
    req.login(newuser,err=>{
        if(err){
            req.flash('error',e.message)
            res.redirect('/users/login')
        }
        req.flash('success','Hello! '+req.user.displayname);
        res.redirect('/')
    })
    req.flash('success','Hello! '+req.user.displayname);
    res.redirect('/')
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/users/register')
    }
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:"/users/login"}),(req,res)=>{
   req.flash('success','Hello! '+req.user.displayname);
   res.redirect('/')
})
router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')
})
module.exports  = router