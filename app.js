var express=require('express'),
		app=express(),
		bodyParser=require('body-parser'),
		mongoose=require('mongoose'),
		flash=require('connect-flash'),
		passport=require('passport'),
		LocalStrategy=require('passport-local'),
		methodOverride=require('method-override'),
		Campground=require('./models/campground'),
		Comment=require('./models/comment'),
		User=require('./models/user'),
		seedDB=require('./seeds');

// requiring routes
const commentRoutes=require('./routes/comments'),
	  campgroundRoutes=require('./routes/campgrounds'),
	  indexRoutes=require('./routes/index');

//console.log(process.env.DATABASEURL); //to look at env vars
//mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
//mongodb://gaurav:gaurav@ds121534.mlab.com:21534/yelpcamp for deployment
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));	// dirname refers to the directory that the script was running 
app.use(methodOverride('_method'));
app.use(flash());
//console.log(__dirname);
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {	//our own middleware and whatever function we provide to it will be called on every route
	res.locals.currentUser=req.user;	//we want to pass req.user to every template whether it contains data or not and whatever we put in our res.locals is available in every template
	//console.log(req.user);
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');
	next(); // and the last thing is you need to call next() to move on to next code and if we don't call it nothing will happen so it's really important to call it
});


app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes); // this will append /campgrounds in every route of campground.js 

app.listen(process.env.PORT||3000,function() {	// for deployment use env.port and not hardcoded port
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});