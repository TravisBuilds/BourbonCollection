const express= require('express');
const router = express.Router(); 
const {ensureAuth, ensureGuest } = require('../middleware/auth');
const story = require('../models/story');

//@desc Login/Landing Page
//@route GET /

router.get('/', ensureGuest, (req,res) =>{
    res.render('login', {
        layout: 'login',
    });
      
});

//@desc Dashboard
//@route GET /dashboard 

router.get('/dashboard', ensureAuth, async (req,res) =>{

    try{
        const stories = await story.find({user: req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            stories,
        })
    }catch(error){
        console.error(err);
        res.render('error/500');
    }
  });

//   router.get('*', (req,res) =>{
//       res.render('error/404');
//   })




module.exports = router