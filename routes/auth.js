const express= require('express');
// const { route } = require('.');
const passport = require('passport');
const router = express.Router(); 

//@desc Login/auth with google 
//@route GET /auth/google
router.get('/google',passport.authenticate('google', {scope: ['profile']}))


//@desc Google auth callback
//@route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google',{failureRedirect:'/'}), (req, res) =>{
    res.redirect('/dashboard')
});


//@desc Logout user
//@route GET /auth/logout

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router