const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../models/user');

//=====================
//AUTH ROUTES
//=====================


// home page
router.get('/',function(req,res) {
	res.render('landing');
});

router.get('/register',function(req,res) {
	res.render('register');
});
// handle sign up
router.post('/register',function(req,res) {
	let newUser=User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user) {
		if(err){
			req.flash('error',err.message);
			return res.render('register');
		}
		passport.authenticate('local')(req,res,function() {
			req.flash('success','Welcome to yelpcamp'+user.username);
			res.redirect('/campgrounds');
		});
	});
});
//show login form
router.get('/login',function(req,res) {
	res.render('login'); 
	//res.render('login',{message:req.flash('error')}); //passing it manually
});
//handling login logic
router.post('/login',passport.authenticate('local',	//middleware will check before callback
	{
		successRedirect:'/campgrounds',
		failureRedirect:'/login'
	}), function(req,res) {
});

//logout route
router.get('/logout',function(req,res) {
	req.logout();	// to log out
	req.flash('success','Logged you out');
	res.redirect('/campgrounds');
});

module.exports=router; 