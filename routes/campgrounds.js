const express=require('express');
const router=express.Router();	// add all the routes on router rather than app
const Campground=require('../models/campground');
const middleware=require('../middleware');	// the name index is given to middleware  because if u rquire just a directory and not specify any name then it will automatically take the one index

// Campground.create({
// 	name:'Granite HIll',
// 	image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg',
// 	description:'This is a huge hill, no bathrooms and no water.'
// },function(err,camp) {
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log('new camp');
// 		console.log(camp);
// 	}
// });

// const campgrounds=[
// 	{name:'Salmon Creek',image:'https://farm8.staticflickr.com/7341/12899401984_3ba1c2d539.jpg'},
// 	{name:'Granite HIll',image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg'},
// 	{name:'MOuntain Goat',image:'https://farm9.staticflickr.com/8076/8289725322_0d6fc08a95.jpg'},
// 	{name:'Salmon Creek',image:'https://farm8.staticflickr.com/7341/12899401984_3ba1c2d539.jpg'},
// 	{name:'Granite HIll',image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg'},
// 	{name:'MOuntain Goat',image:'https://farm9.staticflickr.com/8076/8289725322_0d6fc08a95.jpg'},
// 	{name:'Salmon Creek',image:'https://farm8.staticflickr.com/7341/12899401984_3ba1c2d539.jpg'},
// 	{name:'Granite HIll',image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg'},
// 	{name:'MOuntain Goat',image:'https://farm9.staticflickr.com/8076/8289725322_0d6fc08a95.jpg'},
// 	{name:'Salmon Creek',image:'https://farm8.staticflickr.com/7341/12899401984_3ba1c2d539.jpg'},
// 	{name:'Granite HIll',image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg'},
// 	{name:'MOuntain Goat',image:'https://farm9.staticflickr.com/8076/8289725322_0d6fc08a95.jpg'}
// ];

//=====================
//CAMPGROUND ROUTES
//=====================



// INDEX ROUTE to show all campgrounds
router.get('/',function(req,res) {
	//console.log(req.user);// if not logged in then it will be undefined and if loggedin then it will be username and id and not password (passport takes care of it).
	//res.render('campgrounds',{campgrounds:campgrounds}); // here campgrounds is the array that is defined above
	//get all camps from dbs
	Campground.find({},function(err,allCampgrounds){
		if(err) {
			console.log(err);
		} else{
			
			res.render('campgrounds/index',{campgrounds:allCampgrounds,currentUser:req.user}); // campgrounds is what we get back from the db afer doing the find on Campgrounds
		}																// without middleware we will have to do all this manually in all the routes
	})
});

//REST convention
// CREATE ROUTE add new camp to db and show
router.post('/',middleware.isLoggedIn,function(req,res) {
	// test post route with postman
 	let name=req.body.name;
 	let image=req.body.image;
 	let price=req.body.price;
 	let desc=req.body.description;
 	let author={
 		id:req.user._id,
 		username:req.user.username
 	};
 	let newCampground={
 		name:name,
 		image:image,
 		description:desc,
 		author:author,
 		price:price
 	};
 	//console.log(req.user);
 	//create a new camp and save to db
 	Campground.create(newCampground,function(err,newlyCreated) {
 		if(err) {
 			console.log(err);
 		} else{
 			//redirect back to campgrounds page 
 			//console.log(newlyCreated);
			res.redirect('/');

 		}
 	})

	//get data from form and add to campgrounds array.push(newCampground);
});

// NEW ROUTE show the form to add new camp
router.get('/new',middleware.isLoggedIn,function(req,res) {
	res.render('campgrounds/new');
});

// SHOW ROUTE to show additional info about a particular campground
router.get('/:id',function(req,res) {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {	//req.params.id will give u the parameter in the url while the req.query will give u the key value pair in the url and req.body is used in form to get the user's response
		if(err) {
			console.log(err);
		} else {
			//console.log(foundCampground);	// .populate will populate all the comments and before it was just showing the id of that comment
			res.render('campgrounds/show',{campground:foundCampground});
		}
	});
});

//edit camp route

router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res) {

		Campground.findById(req.params.id,function(err,foundCampground) {
			res.render('campgrounds/edit',{campground:foundCampground});
		});
});
// update camp route
router.put('/:id',middleware.checkCampgroundOwnership,function(req,res) {
	//find and update the correct camp and then redirect
	console.log(req.body.campground);
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

//destroy camp route
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res) {
	Campground.findByIdAndRemove(req.params.id,function(err) {
		if(err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	})
});

module.exports=router; 