const express=require('express');
const router=express.Router({mergeParams:true}); // it will merge the params from the camp and comments
const Campground=require('../models/campground'),
	  Comment=require('../models/comment');
const middleware=require('../middleware');
	  
//==============================
//COMMENTS ROUTES (nested routes)
//==============================

router.get('/new',middleware.isLoggedIn,function(req,res) {
	//find camp by id
	Campground.findById(req.params.id,function(err,campground) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new',{campground:campground});
		}
	})
});

router.post('/',middleware.isLoggedIn,function(req,res){
	//lookup camp using id
	Campground.findById(req.params.id,function(err,campground) {
		if(err){
			req.flash('error','something went wrong');
			res.redirect('/campgrounds');
		} else {
			//create new comment
			//console.log(req.body.comment);
		 	Comment.create(req.body.comment,function(err,comment){
		 		if(err){
		 			console.log(err);
		 		} else {
		 			//add username and id to comment
		 			//console.log(req.user);
		 			comment.author.id=req.user._id;
		 			comment.author.username=req.user.username;
		 			comment.save();
		 			//console.log(comment);
		 			//connect new comment to camp
		 			campground.comments.push(comment);
		 			campground.save();
		 			req.flash('success','successfully added comment');
		 			//redirect camp to show page	
		 			res.redirect('/campgrounds/'+campground._id);
		 		}
		 	})		
		}
	});
});

//COMMENTS EDIT ROUTE

router.get('/:comment_id/edit',middleware.checkCommentOwnership,function(req,res) {
	Comment.findById(req.params.comment_id,function(err,foundComment) {
		if(err) {
			res.redirect('back');
		} else {
			res.render('comments/edit',{campground_id:req.params.id,comment:foundComment});
		}
	});
});

//COMMENT UPDATE
router.put('/:comment_id',function(req,res) {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment) {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/'+req.params.id);
		}
	})
});

//COMMENT DESTROY ROUTE
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res) {
	Comment.findByIdAndRemove(req.params.comment_id,function(err) {
		if(err) {
			res.redirect('back');
		} else {
			req.flash('success','comment deleted');
			res.redirect('/campgrounds/'+req.params.id);
		}
	})
});

module.exports=router; 