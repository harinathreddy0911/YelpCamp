const express = require('express');
const router = express.Router();
const catchAsync = require('../catchAsync');
const Campground = require('../models/campground'); 
const user = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/CreateAccount',(req,res) => {
    res.render('signup');
})

router.get('/login',(req,res) => {
    res.render('Login');
})

// router.post('/verifyUser',  catchAsync(async (req, res) => {

//     console.log('Request Body:', req.body); // Log the request body for debugging
  
//     const { Email, Password } = req.body.User;
  
//     if (!Email || !Password) {
//       return res.status(400).send('Email and Password are required');
//     }  
//     // Wait for findOne to complete before continuing
//       const userdetails = await user.findOne({ Email: Email.trim() , Password: Password.trim() });
  
//       if (!userdetails) {
//         console.log(11)
//         return res.send('Invalid credentials');
//       }else{
//         res.redirect('campground/camps')
//       }
  
    
//   }));

router.post('/verifyUser',
  // use the storeReturnTo middleware to save the returnTo value from session to res.locals
  storeReturnTo,
  // passport.authenticate logs the user in and clears req.session
  passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
  // Now we can use res.locals.returnTo to redirect the user after login
  catchAsync(async  (req, res) => {
      req.flash('success', 'Welcome back!');
      const redirectUrl = res.locals.returnTo || '/campground/camps'; // update this line to use res.locals.returnTo now
      res.redirect(redirectUrl);
  }));


router.post('/newuser', catchAsync(async (req, res,next) => {
  try {
    const { email, username, password } = req.body;
    const User = new user({ email, username }); // Create a new user instance
    const registeredUser = await user.register(User, password); // Register the user
    req.login(registeredUser,err =>{
      if(err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp');
      res.redirect('/campground/camps'); // Redirect to the desired page after registration
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/CreateAccount')
  }
}));

router.get('/logout',(req,res,next)=>{
  req.logOut(function(err){
    if(err){
      return next(err);
    }
    req.flash('success',"You have been logged out");
    res.redirect('/campground/camps')
  })
})

module.exports = router;


module.exports = router;