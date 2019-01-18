// all the middleware goes here
const Campground=require('../models/campground');
const Comment=require('../models/comment');

let middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next) {
		//is user logged in
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id,function(err,foundCampground) {
			if(err) {
				req.flash('error','Camp not found');
				res.redirect('/campgrounds');
			} else {

				//if user is logged in does he own it
				if(foundCampground.author.id.equals(req.user._id)) {	// equals is mongoose method and it is used because camp.auth.id is an object and the other one is a string
					next();
				} else {
					req.flash('error','u dont have permission to do that');
					res.redirect('back');
				}		
			}
		});
	} else {
		req.flash('error','U need to be loggedin boi');
		res.redirect('back'); // it takes back to where you came from
	}

}

middlewareObj.checkCommentOwnership=function(req,res,next) {
		//is user logged in
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,function(err,foundComment) {
			if(err) {
				req.flash('error','Something went wrong');
				res.redirect('back');
			} else {
				//console.log(foundComment);
				//if user is logged in does he own it
				if(foundComment.author.id.equals(req.user._id)) {	// equals is mongoose method and it is used because camp.auth.id is an object and the other one is a string
					next();
				} else {
					req.flash('error','no permisso');
					res.redirect('back');
				}		
			}
		});
	} else {
		req.flash('error','U need to be loggedin boi'); 
		res.redirect('back'); // it takes back to where you came from
	}
}

middlewareObj.isLoggedIn=function(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error','U need to be loggedin to do that boi!!'); // it has to be on req and befor login so that it can send this message to next page and error is key and please login is value here.
	res.redirect('/login');
}

module.exports=middlewareObj;