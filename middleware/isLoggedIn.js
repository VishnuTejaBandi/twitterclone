const isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.flash('error','Please signin to continue');
        return res.redirect('/users/login')
    }
    next();
}